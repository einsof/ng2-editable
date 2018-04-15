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
    <select *ngIf="isActive" class="ng2-editable" [formControl]="control">
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

  ngOnInit() {
    // this.control = new FormControl('', this.validatorOrOpts);
  }

  public getValue = (e: T) => {
    if (this.valueAccessor !== undefined) return this.valueAccessor(e);
    if (this.valueProperty !== undefined) return e[this.valueProperty];
    return e;
  };

  public getLabel = (e: T) => {
    if (this.labelAccessor !== undefined) return this.labelAccessor(e);
    if (this.labelProperty !== undefined) return e[this.labelProperty];
    return e;
  };

  public get currentLabel() {
    const v = this.options.find(e => this.getValue(e) === this.value);
    if (v === undefined) return '';
    return this.getLabel(v);
  }

  protected createToggleEvent = () => ({
    isActive: this.active,
    isChanged: this.value !== this.originalValue
  });

  protected handleStateChange = () => {
    if (this.active) {
      this.originalValue = this.value;
    } else {
      if (this.value !== this.originalValue) {
        this.valueChange.emit(this.value);
      }
    }
  };

  protected resetToDefaultState = () => {
    this.value = this.originalValue;
    this.active = false;
  };

  protected saveChanges = () => {
    this.originalValue = this.value;
    this.active = false;
    this.valueChange.emit(this.value);
  };
}
