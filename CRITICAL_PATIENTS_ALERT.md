# 🚨 Critical Patients Alert Notification

## Feature Overview

The system now displays a **prominent alert notification** at the top of every page when there are patients in critical condition. This ensures medical staff are immediately aware of critical cases requiring urgent attention.

## How It Works

### Alert Display
- ✅ Shows at the top of all pages (Dashboard, Wards, Patients, Staff)
- ✅ Red color scheme for high visibility
- ✅ Animated pulse icon to draw attention
- ✅ Displays up to 3 critical patients with details
- ✅ Shows total count if more than 3 critical patients
- ✅ Can be dismissed with X button

### Alert Content

The notification shows:
1. **Alert Icon**: Pulsing warning triangle (red)
2. **Title**: "Critical Patient Alert"
3. **Count**: Number of critical patients
4. **Patient List**: Up to 3 patients with:
   - Patient name
   - Diagnosis
   - Red status indicator
5. **Action Button**: "View all critical patients →" (navigates to Patients page)
6. **Close Button**: X icon to dismiss the alert

### When Alert Appears

The alert automatically appears when:
- ✅ Any patient has status = "Critical"
- ✅ Multiple patients are in critical condition
- ✅ New patient is marked as critical
- ✅ Patient status changes to critical

### When Alert Disappears

The alert is hidden when:
- ✅ User clicks the X (close) button
- ✅ No patients have "Critical" status
- ✅ All critical patients are discharged or status changed

## Visual Design

### Colors
- **Background**: Light red (`bg-red-50`)
- **Border**: Red left border (`border-red-500`)
- **Text**: Dark red (`text-red-800`, `text-red-700`)
- **Icon**: Red with pulse animation

### Layout
```
┌─────────────────────────────────────────────────────────┐
│ ⚠️  Critical Patient Alert                          ✕   │
│                                                          │
│ 3 patients in critical condition                        │
│                                                          │
│ • John Doe - Cardiac Arrest                             │
│ • Jane Smith - Severe Pneumonia                         │
│ • Bob Johnson - Multiple Injuries                       │
│                                                          │
│ View all critical patients →                            │
└─────────────────────────────────────────────────────────┘
```

## User Interactions

### Click "View all critical patients"
- Navigates to `/patients` page
- Automatically dismisses the alert
- Patients page can be filtered to show only critical patients

### Click X (Close)
- Dismisses the alert for current session
- Alert reappears on page refresh if critical patients still exist
- Does not affect patient status

## Integration Points

### 1. Layout Component
- Alert is integrated into main layout
- Appears on all pages consistently
- Positioned above page content

### 2. Patient Status
- Monitors patient status in real-time
- Automatically detects "Critical" status
- Updates when patient status changes

### 3. Navigation
- Clicking alert navigates to Patients page
- Seamless integration with React Router
- Maintains app state during navigation

## Example Scenarios

### Scenario 1: Single Critical Patient
```
Alert shows:
"1 patient in critical condition"
• John Doe - Cardiac Arrest
```

### Scenario 2: Multiple Critical Patients
```
Alert shows:
"5 patients in critical condition"
• John Doe - Cardiac Arrest
• Jane Smith - Severe Pneumonia
• Bob Johnson - Multiple Injuries
+2 more critical patients
```

### Scenario 3: No Critical Patients
```
Alert does not appear
(Normal operation)
```

## Benefits

✅ **Immediate Awareness**: Staff see critical cases instantly
✅ **High Visibility**: Red color and animation ensure it's noticed
✅ **Quick Access**: One click to view all critical patients
✅ **Dismissible**: Can be closed if already aware
✅ **Real-time**: Updates automatically when status changes
✅ **Context Aware**: Shows patient names and diagnoses

## Technical Details

### Component: `CriticalPatientsAlert.jsx`
- React functional component
- Uses Lucide icons (AlertTriangle, X)
- Integrates with React Router for navigation
- Conditional rendering based on critical patient count

### Props
- `criticalPatients`: Array of patients with status = "Critical"
- `onClose`: Callback function to dismiss alert

### State Management
- Uses AppContext to access patient data
- Filters patients by status === "Critical"
- Local state for alert dismissal

## Customization Options

You can customize:
- Number of patients shown (currently 3)
- Alert colors and styling
- Animation effects
- Auto-dismiss timeout (if desired)
- Sound notification (if desired)

## Testing

To test this feature:

1. **Add a critical patient**:
   - Go to Patients page
   - Add new patient or edit existing
   - Set status to "Critical"
   - Alert should appear at top

2. **View alert details**:
   - Check patient name and diagnosis shown
   - Verify count is correct

3. **Click "View all critical patients"**:
   - Should navigate to Patients page
   - Alert should dismiss

4. **Dismiss alert**:
   - Click X button
   - Alert should disappear

5. **Multiple critical patients**:
   - Mark 5+ patients as critical
   - Verify "+X more" message appears

## Future Enhancements

Possible improvements:
- 🔔 Sound notification for new critical patients
- 📧 Email/SMS alerts to staff
- ⏰ Auto-refresh every X minutes
- 📊 Critical patient trends
- 🏥 Ward-specific critical alerts
- 🔴 Severity levels (Critical, Very Critical, etc.)

---

**Status**: ✅ Implemented and ready to use!

The alert will automatically appear when patients are marked as critical. No configuration needed! 🚨
