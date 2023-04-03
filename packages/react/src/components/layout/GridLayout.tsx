import * as React from 'react';
import type { UseParticipantsOptions } from '../../hooks';
import { useGridLayout, usePagination } from '../../hooks';
import { mergeProps } from '../../utils';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { TrackLoop } from '../TrackLoop';
import { PaginationControl } from '../controls/PaginationControl';

export interface GridLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<UseParticipantsOptions, 'updateOnlyOn'> {
  tracks: TrackReferenceOrPlaceholder[];
}

/**
 * The GridLayout component displays the nested participants in a grid where every participants has the same size.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <GridLayout track={tracks} />
 * <LiveKitRoom>
 * ```
 */
export function GridLayout({ tracks, ...props }: GridLayoutProps) {
  const gridEl = React.createRef<HTMLDivElement>();

  const elementProps = React.useMemo(
    () => mergeProps(props, { className: 'lk-grid-layout' }),
    [props],
  );
  const { layout } = useGridLayout(gridEl, tracks.length);
  const pagination = usePagination(layout.maxTiles, tracks);

  return (
    <div ref={gridEl} {...elementProps}>
      <TrackLoop tracks={pagination.tracks}>{props.children}</TrackLoop>
      {tracks.length > layout.maxTiles && (
        <PaginationControl pagesContainer={gridEl} {...pagination} />
      )}
    </div>
  );
}
