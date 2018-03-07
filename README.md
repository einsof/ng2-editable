# ng2-editable-custom
In-place editing for Angular2 (fork of ng2-editable)

## Installation
ng2-editable-custom is available via npm:

`npm install --save ng2-editable-custom`

Use it by improting `EditableModule` into your module:
```typescript
import { EditableModule } from 'ng2-editable-custom';

@NgModule({
  imports: [
    EditableModule,
    ...
  ]
})
```

To use components in other modules, also add `EditableModule` to `exports`.

## Usage
Include the components you need into your HTML file, specifying the property you want to bind to.
```typescript
<ng2-input-editable [(text)]="myText"</ng2-input-editable>
```
or
```typescript
<ng2-textarea-editable [(text)]="myText"</ng2-textarea-editable>
```
ng2-editable-custom uses two-way binding, so no event handlers are required.

The component will render the property you provide. On click, it will replace it with an `<input>` or `<select>` element. It will return to default state if you click anywhere else.

## Documentation
### Common features
#### Toggle event
All ng2-editable-custom components expose a `(toggled)` Output which will fire whenever the component changes state. It emits an object with the following interface:
```typescript
interface ToggleEvent {
  isActive: boolean;
  isChanged: boolean;
};
```

### Text editable
A simple component for editing strings.

selector: **ng2-input-editable** or **ng2-textarea-editable**

property name: **text**

### Date editable
Same as text editable, but takes dates and provides a calendar.

selector: **ng2-date-editable**

property name: **date**

### Selectable
This component allows selecting an option from a dropdown list.

selector: **ng2-selectable**

property name: **value**

#### Required inputs
*options*: the list of options to select from, must be an array of any type.

#### Optional inputs
*valueProperty*: the property which will be used as the value of the option; defaults to `id`

*labelProperty*: the property of the object which will be displayed; defaults to `label`

*valueAccessor*: a function which takes an element of the list and returns its value; has precedence over `valueProperty`

*labelAccessor*: a function which renders an element of the list as a string; has precedence over `labelProperty`

#### Example
```html
<ng2-selectable [(value)]="userId" [options]="users"
  [labelAccessor]="getUserLabel">
</ng2-selectable>
```
```typescript
public getUserLabel = (user) => `${user.name} (${user.organization})`;
```

### Toggleable
A component that displays boolean states.

selector: **ng2-toggleable**

property name: **value**

#### Optional inputs:
*showFalse*: if true, does not display anything if value is true; defaults to false.

## Contribute
Original contributions are welcome on [Github](https://github.com/poznyakovskiy/ng2-editable).
Fork on [Github](https://github.com/einsof/ng2-editable).
