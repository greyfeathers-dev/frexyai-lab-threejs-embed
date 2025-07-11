# Sentry Interaction Error Monitoring Setup

## Overview
This project has been configured with Sentry specifically for monitoring the 9 user interactions. Sentry will capture:
- **Interaction failures** - When any of the 9 interactions fail to execute properly
- **Interaction successes** - When interactions complete successfully
- **Detailed context** - User data, interaction settings, and failure reasons

## The 9 Monitored Interactions

1. **Welcome New Visitor** - First-time visitor greeting
2. **Welcome Returning Visitor** - Returning visitor greeting  
3. **Avoid Bounce** - Prevents users from leaving immediately
4. **Idle on Page** - Triggers when user is inactive
5. **Normal Exit Intent** - Detects when user is about to leave
6. **Confused?** - Triggers when user visits multiple pages without scrolling
7. **Click Assist** - Encourages clicks on high-intent buttons
8. **Head-Cursor Sync** - 3D model head follows mouse cursor
9. **Click-to-Dance** - Model dances when clicked

## Configuration

### 1. Sentry DSN
The Sentry DSN is configured in `index.html`:
```javascript
Sentry.init({
  dsn: "https://dfbe70065e3f6c91f6549e47afab44b3@js-de.sentry-cdn.com/4500000000000000",
  environment: "development", // Change to "production" for production
  // ... other config
});
```

### 2. Interaction Error Tracking Functions
Two main functions handle interaction monitoring:

```javascript
// Track interaction failures
trackInteractionFailure(interactionName, error, context)

// Track interaction successes  
trackInteractionSuccess(interactionName, context)
```

## How to Check for Interaction Failures

### 1. Sentry Dashboard
1. Go to your Sentry dashboard
2. Navigate to the Issues section
3. Filter by:
   - `type:interaction_failure` - Shows only interaction failures
   - `interaction:welcome_new_visitor` - Filter by specific interaction
   - `category:user_interaction` - All interaction events

### 2. Console Logging
All interaction failures are logged with detailed information:
```javascript
console.error("Interaction Failure - Welcome New Visitor:", {
  error: "Interaction data not found in INTERACTION_DATA",
  interaction: "welcome_new_visitor",
  context: { stage: "initialization", leadId: "123" }
});
```

### 3. Test Function
Use the "Test Sentry Error" button to manually trigger test failures for all 9 interactions.

## Error Categories

### Interaction Failures
- **Missing Interaction Data** - Interaction not found in INTERACTION_DATA
- **Animation Failures** - 3D animations fail to load or play
- **Audio Failures** - Audio playback issues
- **UI Animation Failures** - Tooltip/overlay display issues
- **Initialization Failures** - Setup problems (e.g., missing neck bone)

### Success Tracking
- **Successful Triggers** - When interactions complete successfully
- **Performance Data** - Animation duration, audio status
- **User Context** - Lead ID, user behavior, page context

## Sentry Query Examples

### Find All Interaction Failures
```
type:interaction_failure
```

### Find Specific Interaction Issues
```
interaction:welcome_new_visitor OR interaction:avoid_bounce
```

### Find Recent Failures
```
type:interaction_failure lastSeen:>2024-01-01
```

### Find High-Impact Failures
```
type:interaction_failure frequency:>10
```

### Find Success Events
```
type:interaction_success
```

## Error Context Data

Each interaction failure includes:

### Standard Context
- `interactionName` - Human-readable interaction name
- `interactionKey` - Machine-readable key
- `leadId` - Current lead identifier
- `userId` - User/merchant identifier
- `currentUrl` - Page where failure occurred
- `userAgent` - Browser information
- `timestamp` - When the failure occurred

### Interaction-Specific Context
- `interactionId` - Database ID of the interaction
- `stage` - Where in the process the failure occurred
- `hasAudio` - Whether audio was involved
- `animation` - Which animation was attempted
- `buttonText` - For Click Assist (which button)
- `visitCount` - For Confused? (how many pages visited)
- `scrollPercentage` - For scroll-based interactions

## Environment Setup

### Development
```javascript
environment: "development"
```

### Production
```javascript
environment: "production"
```

## Best Practices

1. **Monitor Interaction Failures**: Check Sentry regularly for interaction issues
2. **Use Tags for Filtering**: Filter by interaction name, failure type, or stage
3. **Review Context**: Use the extra data to understand failure conditions
4. **Set Up Alerts**: Configure Sentry to notify you of critical interaction failures
5. **Track Success Rates**: Monitor both failures and successes to understand interaction health

## Troubleshooting

### No Interaction Failures Showing
- Verify environment setting matches your deployment
- Check if interactions are enabled in your configuration
- Test with the manual error button

### Missing Context Data
- Ensure INTERACTION_DATA is properly loaded
- Check that leadId and userId are available
- Verify Sentry is initialized before interactions run

### Performance Impact
- Interaction tracking is lightweight and non-blocking
- Only captures errors, not all interaction attempts
- Minimal impact on user experience

## Testing

### Manual Testing
Click the "Test Sentry Error" button to generate:
- 9 failure events (one for each interaction)
- 1 success event
- Various failure types and contexts

### Real-World Testing
- Enable different interactions
- Trigger them through normal user behavior
- Check Sentry dashboard for captured events

## Integration with Analytics

The interaction tracking can be correlated with:
- User engagement metrics
- Conversion rates
- Page performance data
- User journey analysis 