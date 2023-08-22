<!-- Do not edit this file. It is automatically generated by API Documenter. -->

# ParticipantLoop

The ParticipantLoop component loops over an array of participants to create a context for every participant. This component takes exactly one child component as a template. By providing your own template as a child you have full control over the look and feel of your participant representations.

## Import

```typescript
import { ParticipantLoop } from '@livekit/components-react';
```

## Remarks

If you want to loop over individual tracks instead of participants, you can use the `TrackLoop` component.

## Usage

```tsx
const participants = useParticipants();
<ParticipantLoop participants={participants}>
  <ParticipantName />
<ParticipantLoop />
```

{% partial file="p_usage.md" /%}

## Properties

{% parameter name="children" type="React.ReactNode" optional=false %}
The template component to be used in the loop.

{% /parameter %}

{% parameter name="participants" type="Participant[]" optional=false %}
The participants to loop over. Use `useParticipants()` hook to get participants.

{% /parameter %}