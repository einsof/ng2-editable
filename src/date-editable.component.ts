import {
  Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { EditableComponent } from './editable.component';

@Component({
  moduleId: 'ng2-editable-custom',
  selector: 'ng2-date-editable',
  template: `
    {{isActive ? '' : (date | date:'mediumDate')}}
    <input *ngIf="isActive" type="date" [value]="date | date:'yyyy-MM-dd'" (input)="date=parseDate($event.target.value)">
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateEditableComponent extends EditableComponent {

  @Input() public date = new Date();
  @Output() public dateChange = new EventEmitter<Date>();

  private originalDate = new Date();

  constructor (
    cdRef: ChangeDetectorRef,
    elem: ElementRef
  ) {
    super(cdRef, elem);
  }

  protected createToggleEvent = () => ({
    isActive: this.active,
    isChanged: ((this.date === undefined || this.originalDate === undefined) && this.date !== this.originalDate) ||
      this.date.getFullYear() !== this.originalDate.getFullYear() ||
      this.date.getMonth() !== this.originalDate.getMonth() ||
      this.date.getDate() !== this.originalDate.getDate()
  });

  protected handleStateChange = () => {
    if (this.active) {
      this.originalDate = this.date;
    } else {
      if (this.date !== this.originalDate) {
        this.dateChange.emit(this.date);
      }
    }
  };

  protected resetToDefaultState = () => {
    this.date = this.originalDate;
    this.active = false;
  };

  protected saveChanges = () => {
    this.originalDate = this.date;
    this.active = false;
    this.dateChange.emit(this.date);
  };

  public parseDate = (input: string) => {
    const date = new Date(input);
    return isNaN(date.getTime())
      ? undefined
      : date;
  };

}
