<!-- Do not edit this file. It is automatically generated by API Documenter. -->

# TrackMutedIndicator

The TrackMutedIndicator shows whether the participant's camera or microphone is muted or not.

## Import

```typescript
import { TrackMutedIndicator } from '@livekit/components-react';
```

## Usage

```tsx
<TrackMutedIndicator source={Track.Source.Camera} />
<TrackMutedIndicator source={Track.Source.Microphone} />
```

{% partial file="p_usage.md" /%}

## Properties

{% parameter name="participant" type="Participant" optional=true %}
_(Optional)_

{% /parameter %}

{% parameter name="show" type="'always' | 'muted' | 'unmuted'" optional=true %}
_(Optional)_

{% /parameter %}

{% parameter name="source" type="Track.Source" optional=false %}
{% /parameter %}