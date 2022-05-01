# Time Entry

## Overview

Similar to the the other pages, the time entry page uses a table to display/provide the principal interface. This table is contained in `EntryTable.js`.

All of the input components, ( `DropdownEntryInput.js`, `DeleteEntryInput.js`, `HourEntryInput.js`, `AlternativeEntryInput.js`, and `DayCommentInput.js` ) are used in cells in the table. Each input also handles all changes to its respective data through redux. This way we avoid calling back to the top level component each time.

## Components

<dl>
<dt><a href="#AlternativeEntryInput">AlternativeEntryInput</a></dt>
<dd><p>Input for alternate transport. Provides a checkbox for a boolean result.</p>
</dd>
<dt><a href="#DayCommentInput">DayCommentInput</a></dt>
<dd><p>Input for day comments. Provides an icon which can be clicked to provide a popover input.</p>
</dd>
<dt><a href="#DeleteEntryInput">DeleteEntryInput</a></dt>
<dd><p>Delete button for rows. Provides an icon which can be clicked to delete a row.</p>
</dd>
<dt><a href="#DropdownEntryInput">DropdownEntryInput</a></dt>
<dd><p>Input for Department, Project, and Work Code. 
Provides an dropdown menu with filtered options.</p>
</dd>
<dt><a href="#EntryDatePicker">EntryDatePicker</a></dt>
<dd><p>Picks timesheet start date. Provides a react-dates input aswell as arrows.</p>
</dd>
<dt><a href="#EntryTable">EntryTable</a></dt>
<dd><p>Provides the time entry table interface.</p>
</dd>
<dt><a href="#HourEntryInput">HourEntryInput</a></dt>
<dd><p>Hour entry input. Provides a input field which takes a number.</p>
</dd>
<dt><a href="#TemplateSelect">TemplateSelect</a></dt>
<dd><p>Allows for template selection, addition, and deletion. 
Provides a dropdown for selection, a button to save templates, and an interface to manage.</p>
</dd>
<dt><a href="#TimeEntry">TimeEntry</a></dt>
<dd><p>Root time entry screen componenet.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#useTimeEntry">useTimeEntry(settings, userTimeEntry, loadTimeSheet, loadUserWorkCodes, loadTimeEntryTemplates, currentUser)</a></dt>
<dd><p>TimeEntry custom hook. This is a custom hook. It is for organizational purposes. 
Information on custom hooks here <a href="https://reactjs.org/docs/hooks-custom.html">https://reactjs.org/docs/hooks-custom.html</a></p>
</dd>
</dl>

<a name="AlternativeEntryInput"></a>

## AlternativeEntryInput

Input for alternate transport. Provides a checkbox for a boolean result.

**Kind**: global variable  
**Category**: Time Entry  
**Component**:

### PropTypes:

| Name                       | Type   | Required | Description | Default |
| -------------------------- | ------ | -------- | ----------- | ------- |
| `loading`                  | bool   | Yes      |             |         |
| `work`                     | object | Yes      |             |         |
| `disableModification`      | bool   | Yes      |             |         |
| `saveTimeEntryAlternate`   | func   | Yes      |             |         |
| `deleteTimeEntryAlternate` | func   | Yes      |             |         |

<a name="DayCommentInput"></a>

## DayCommentInput

Input for day comments. Provides an icon which can be clicked to provide a popover input.

**Kind**: global variable  
**Category**: Time Entry  
**Component**:

### PropTypes:

| Name                  | Type   | Required | Description | Default |
| --------------------- | ------ | -------- | ----------- | ------- |
| `dayComment`          | object | Yes      |             |         |
| `disableModification` | bool   | Yes      |             |         |
| `deleteDayComment`    | func   | Yes      |             |         |
| `saveDayComment`      | func   | Yes      |             |         |

<a name="DeleteEntryInput"></a>

## DeleteEntryInput

Delete button for rows. Provides an icon which can be clicked to delete a row.

**Kind**: global variable  
**Category**: Time Entry  
**Component**:

### PropTypes:

| Name                  | Type   | Required | Description | Default |
| --------------------- | ------ | -------- | ----------- | ------- |
| `row`                 | object | Yes      |             |         |
| `setShowConfirmModal` | func   | Yes      |             |         |
| `showConfirmModal`    | bool   | Yes      |             |         |
| `deleteTimeEntryRow`  | func   | Yes      |             |         |
| `hourEntries`         | array  | Yes      |             |         |
| `disableModification` | bool   | Yes      |             |         |

<a name="DropdownEntryInput"></a>

## DropdownEntryInput

Input for Department, Project, and Work Code.
Provides an dropdown menu with filtered options.

**Kind**: global variable  
**Category**: Time Entry  
**Component**:

### PropTypes:

| Name                  | Type   | Required | Description | Default |
| --------------------- | ------ | -------- | ----------- | ------- |
| `value`               | number | Yes      |             |         |
| `loading`             | bool   | Yes      |             |         |
| `row`                 | object | Yes      |             |         |
| `column`              | object | Yes      |             |         |
| `data`                | array  | Yes      |             |         |
| `workCodes`           | array  | Yes      |             |         |
| `projects`            | array  | Yes      |             |         |
| `departments`         | array  | Yes      |             |         |
| `disableModification` | bool   | Yes      |             |         |
| `updateTimeEntryRow`  | func   | Yes      |             |         |
| `setSkipPageReset`    | func   | Yes      |             |         |
| `hourEntries`         | array  | Yes      |             |         |

<a name="EntryDatePicker"></a>

## EntryDatePicker

Picks timesheet start date. Provides a react-dates input aswell as arrows.

**Kind**: global variable  
**Category**: Time Entry  
**Component**:

### PropTypes:

| Name                   | Type   | Required | Description | Default |
| ---------------------- | ------ | -------- | ----------- | ------- |
| `updateEntryStartDate` | func   | Yes      |             |         |
| `startDate`            | object | Yes      |             |         |
| `onDateChange`         | func   | Yes      |             |         |

<a name="EntryTable"></a>

## EntryTable

Provides the time entry table interface.

**Kind**: global variable  
**Category**: Time Entry  
**Component**:

### PropTypes:

| Name                  | Type  | Required | Description | Default |
| --------------------- | ----- | -------- | ----------- | ------- |
| `disableModification` | bool  | Yes      |             |         |
| `addNewEntryRow`      | func  | Yes      |             |         |
| `alternateData`       | array | Yes      |             |         |
| `columns`             | array | Yes      |             |         |
| `data`                | array | Yes      |             |         |
| `skipPageReset`       | bool  | Yes      |             |         |
| `setSkipPageReset`    | func  | Yes      |             |         |
| `workCodes`           | array | Yes      |             |         |
| `loading`             | bool  | Yes      |             |         |
| `dailyTotals`         | array | Yes      |             |         |
| `dayComments`         | array | Yes      |             |         |

<a name="HourEntryInput"></a>

## HourEntryInput

Hour entry input. Provides a input field which takes a number.

**Kind**: global variable  
**Category**: Time Entry  
**Component**:

### PropTypes:

| Name                  | Type   | Required | Description | Default |
| --------------------- | ------ | -------- | ----------- | ------- |
| `value`               | object | Yes      |             |         |
| `loading`             | bool   | Yes      |             |         |
| `row`                 | object | Yes      |             |         |
| `columnIndex`         | number | Yes      |             |         |
| `data`                | array  | Yes      |             |         |
| `disableModification` | bool   | Yes      |             |         |
| `setSkipPageReset`    | func   | Yes      |             |         |
| `updateTimeEntryHour` | func   | Yes      |             |         |
| `removeTimeEntryHour` | func   | Yes      |             |         |

<a name="TemplateSelect"></a>

## TemplateSelect

Allows for template selection, addition, and deletion.
Provides a dropdown for selection, a button to save templates, and an interface to manage.

**Kind**: global variable  
**Category**: Time Entry  
**Component**:

### PropTypes:

| Name                    | Type   | Required | Description | Default |
| ----------------------- | ------ | -------- | ----------- | ------- |
| `templates`             | array  | Yes      |             |         |
| `timeSheet`             | array  | Yes      |             |         |
| `currentUser`           | object | Yes      |             |         |
| `loadTimeSheetTemplate` | func   | Yes      |             |         |
| `startDate`             | object | No       |             |         |
| `saveNewTemplate`       | func   | Yes      |             |         |
| `updateTemplate`        | func   | Yes      |             |         |
| `deleteTemplate`        | func   | Yes      |             |         |

<a name="TimeEntry"></a>

## TimeEntry

Root time entry screen componenet.

**Kind**: global variable  
**Category**: Time Entry  
**Component**:

### PropTypes:

| Name                     | Type   | Required | Description | Default |
| ------------------------ | ------ | -------- | ----------- | ------- |
| `currentUser`            | object | Yes      |             |         |
| `addTimeEntryRow`        | func   | Yes      |             |         |
| `loadUserWorkCodes`      | func   | Yes      |             |         |
| `settings`               | object | Yes      |             |         |
| `loadTimeSheet`          | func   | Yes      |             |         |
| `workDays`               | array  | Yes      |             |         |
| `hourEntries`            | array  | Yes      |             |         |
| `alternateEntries`       | array  | Yes      |             |         |
| `userTimeEntry`          | object | Yes      |             |         |
| `loadTimeEntryTemplates` | func   | Yes      |             |         |

<a name="useTimeEntry"></a>

## useTimeEntry(settings, userTimeEntry, loadTimeSheet, loadUserWorkCodes, loadTimeEntryTemplates, currentUser)

TimeEntry custom hook. This is a custom hook. It is for organizational purposes.
Information on custom hooks here https://reactjs.org/docs/hooks-custom.html

**Kind**: global function  
**Category**: Time Entry

| Param                  | Type                  | Description                                 |
| ---------------------- | --------------------- | ------------------------------------------- |
| settings               | <code>Object</code>   | Time sheet settings.                        |
| userTimeEntry          | <code>Object</code>   | User time sheet information.                |
| loadTimeSheet          | <code>function</code> | Function to load timesheet.                 |
| loadUserWorkCodes      | <code>function</code> | Function to load user work codes.           |
| loadTimeEntryTemplates | <code>function</code> | Function to load user time entry templates. |
| currentUser            | <code>Object</code>   | Currently logged in user information.       |
