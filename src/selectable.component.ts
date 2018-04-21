import {
  Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { EditableComponent } from './editable.component';

@Component({
  moduleId: 'ng2-editable-custom',
  selector: 'ng2-selectable',
  template: `
    {{isActive ? '' : currentLabel}}
    <select *ngIf="isActive" value="{{value}}" class="ng2-editable" [formControl]="control" (focus)="onFocus($event)" (blur)="onBlur($event)">
      <option *ngFor="let option of options" [value]="getValue(option)">
        {{getLabel(option)}}
      </option>
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectableComponent<T> extends EditableComponent {

  @Output() public valueChange = new EventEmitter<any>();

  @Input() public options: T[] = [];
  @Input() public valueProperty = 'id';
  @Input() public labelProperty = 'label';
  @Input() public valueAccessor: ((e: T) => any) | undefined;
  @Input() public labelAccessor: ((e: T) => string) | undefined;

  private originalValue: any;

  constructor (
    cdRef: ChangeDetectorRef,
    elem: ElementRef
  ) {
    super(cdRef, elem);
  }

  public onFocus (event: FocusEvent) {
    this.focused = true;
  }

  public onBlur (event: FocusEvent) {
    this.focused = false;
  }

  public getValue = (e: T) => {
    if (this.valueAccessor !== undefined) return this.valueAccessor(e);
    if (this.valueProperty !== undefined) return e[this.valueProperty];
    return e;
  }

  public getLabel = (e: T) => {
    if (this.labelAccessor !== undefined) return this.labelAccessor(e);
    if (this.labelProperty !== undefined) return e[this.labelProperty];
    return e;
  }

  public get currentLabel() {
    const v = this.options.find(e => this.getValue(e) === this.control.value);
    if (v === undefined) return '';
    return this.getLabel(v);
  }

  protected createToggleEvent = () => ({
    isActive: this.active,
    isChanged: this.control.value !== this.originalValue
  })

  protected handleStateChange = () => {
    if (this.active) {
      this.originalValue = this.value;
      this.control.setValue(this.value);
    } else {
      if (this.control.value !== this.originalValue) {
        this.valueChange.emit(this.control.value);
      }
    }
  }

  protected resetToDefaultState = () => {
    this.control.setValue(this.originalValue);
    this.active = false;
  }

  protected saveChanges = () => {
    this.originalValue = this.control.value;
    this.active = false;
    this.valueChange.emit(this.control.value);
  }
}
