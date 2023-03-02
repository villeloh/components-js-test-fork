import {
  isSourcesWithOptions,
  isSourceWitOptions,
  log,
  MaybeTrackParticipantPair,
  SourcesArray,
  TrackParticipantPair,
  trackParticipantPairsObservable,
  TrackSourceWithOptions,
} from '@livekit/components-core';
import { Participant, RoomEvent, Track } from 'livekit-client';
import * as React from 'react';
import { useRoomContext } from '../context';

type UseTracksOptions = {
  updateOnlyOn?: RoomEvent[];
};

type UseTracksHookReturnType<T> = T extends Track.Source[]
  ? TrackParticipantPair[]
  : T extends TrackSourceWithOptions[]
  ? MaybeTrackParticipantPair[]
  : never;

/**
 * The `useTracks` hook returns an array of TrackParticipantPairs which combine the participant, publication and a track.
 * Only tracks with a the same source specified via the sources property get included in the loop.
 * This hook can also return placeholders alongside `TrackParticipantPair`'s, so they can appear as tiles even without a subscribed track.
 *
 * @example
 * ```ts
 * const pairs = useTracks(sources: [Track.Source.Camera])
 * ```
 * @example
 * ```ts
 * const pairs = useTracks(sources: [{source: Track.Source.Camera, withPlaceholder: true}])
 * ```
 */
export function useTracks<T extends SourcesArray>(
  sources: T,
  options: UseTracksOptions = {},
): UseTracksHookReturnType<T> {
  const room = useRoomContext();
  const [pairs, setPairs] = React.useState<TrackParticipantPair[]>([]);
  const [participants, setParticipants] = React.useState<Participant[]>([]);

  const sources_ = React.useMemo(() => {
    return sources.map((s) => (isSourceWitOptions(s) ? s.source : s));
  }, [JSON.stringify(sources)]);

  React.useEffect(() => {
    const subscription = trackParticipantPairsObservable(room, sources_, {
      additionalRoomEvents: options.updateOnlyOn,
    }).subscribe(({ trackBundles, participants }) => {
      setPairs(trackBundles);
      setParticipants(participants);
    });
    return () => subscription.unsubscribe();
  }, [room, JSON.stringify(options.updateOnlyOn), JSON.stringify(sources)]);

  const maybeTrackBundles = React.useMemo(() => {
    if (isSourcesWithOptions(sources)) {
      const requirePlaceholder = requiredPlaceholders(sources, participants);
      const pairs_ = Array.from(pairs) as MaybeTrackParticipantPair[];
      participants.forEach((participant) => {
        if (requirePlaceholder.has(participant.identity)) {
          const sourcesToAddPlaceholder = requirePlaceholder.get(participant.identity) ?? [];
          sourcesToAddPlaceholder.forEach((placeholderSource) => {
            log.debug(
              `Add ${placeholderSource} placeholder for participant ${participant.identity}.`,
            );
            pairs_.push({ participant, track: undefined, source: placeholderSource });
          });
        }
      });
      return pairs_;
    } else {
      return pairs;
    }
  }, [pairs, participants, sources]);

  return maybeTrackBundles as UseTracksHookReturnType<T>;
}

function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

export function requiredPlaceholders<T extends SourcesArray>(
  sources: T,
  participants: Participant[],
): Map<Participant['identity'], Track.Source[]> {
  const placeholderMap = new Map<Participant['identity'], Track.Source[]>();
  if (isSourcesWithOptions(sources)) {
    const sourcesThatNeedPlaceholder = sources
      .filter((sourceWithOption) => sourceWithOption.withPlaceholder)
      .map((sourceWithOption) => sourceWithOption.source);

    participants.forEach((participant) => {
      const sourcesOfSubscribedTracks = participant
        .getTracks()
        .map((pub) => pub.track?.source)
        .filter((trackSource): trackSource is Track.Source => trackSource !== undefined);
      const placeholderNeededForThisParticipant = Array.from(
        difference(new Set(sourcesThatNeedPlaceholder), new Set(sourcesOfSubscribedTracks)),
      );
      // If the participant needs placeholder add it to the placeholder map.
      if (placeholderNeededForThisParticipant.length > 0) {
        placeholderMap.set(participant.identity, placeholderNeededForThisParticipant);
      }
    });
  }
  return placeholderMap;
}