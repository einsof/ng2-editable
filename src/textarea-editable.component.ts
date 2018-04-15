import {
  Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { EditableComponent } from './editable.component';
import {ValidatorFn} from "@angular/forms/src/directives/validators";
import {AbstractControlOptions} from "@angular/forms/src/model";

@Component({
  moduleId: 'ng2-editable-custom',
  selector: 'ng2-textarea-editable',
  template: `
    {{isActive ? '' : text}}
    <textarea *ngIf="isActive" [(ngModel)]="text" placeholder="{{placeholder}}" class="ng2-editable" [formControl]="{formControlName}"></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaEditableComponent extends EditableComponent implements OnInit {

  @Input() public text = '';
  @Input() public placeholder = '';
  @Input() public formControlName = '';
  @Input() public validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
  @Output() public textChange = new EventEmitter<string>();

  private originalText = '';
  private control: FormControl;

  constructor (
    cdRef: ChangeDetectorRef,
    elem: ElementRef
  ) {
    super(cdRef, elem);
  }

  ngOnInit() {
    this.control = new FormControl('', this.validatorOrOpts);
  }

  protected createToggleEvent = () => ({
    isActive: this.active,
    isChanged: this.text !== this.originalText
  });

  protected handleStateChange = () => {
    if (this.active) {
      this.originalText = this.text;
    } else {
      if (this.text !== this.originalText) {
        this.textChange.emit(this.text);
      }
    }
  };

  protected resetToDefaultState = () => {
    this.text = this.originalText;
    this.active = false;
  };

  protected saveChanges = () => {
    this.originalText = this.text;
    this.active = false;
    this.textChange.emit(this.text);
  };
}