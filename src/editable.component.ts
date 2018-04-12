import { Output, Input, EventEmitter, ElementRef, ChangeDetectorRef, HostListener, HostBinding } from '@angular/core';

import { ToggleEvent } from './models';

export abstract class EditableComponent {

  @Output() public toggled = new EventEmitter<ToggleEvent>();

  @Input()
  public get isActive() {
    return this._isActive;
  }

  public set isActive(value: boolean) {
    if (value !== this._isActive) {
        this._isActive = value;
        this._cdRef.markForCheck();
        this._handleStateChange();
        this.toggled.emit(this._createToggleEvent());
    }
  }

  @HostBinding('class.edited') private _isActive = false;

  protected abstract _createToggleEvent: () => ToggleEvent;

  protected abstract _handleStateChange: () => void;

  constructor (
    private _cdRef: ChangeDetectorRef,
    private _elem: ElementRef
  ) { }

  @HostListener('click') public onClick() {
      this.isActive = true;
  }

  @HostListener('document:click', ['$event']) public onClickAnywhere (event: Event) {
    if (this.isActive && !this._elem.nativeElement.contains(event.target)) {
      event.preventDefault();
      this.isActive = false;
    }
  }

}
