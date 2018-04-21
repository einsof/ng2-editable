import {
    Output, Input, EventEmitter, ElementRef, ChangeDetectorRef, HostListener, HostBinding,
    OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AbstractControlOptions } from '@angular/forms/src/model';

import { ToggleEvent } from './models';

export enum keycode {
    escape = 27,
    enter = 13
}

export abstract class EditableComponent implements OnInit {

  @Output() public toggled = new EventEmitter<ToggleEvent>();

  @Input() public value: any;
  @Input() public exclude: string = '';
  @Input() public needExclude: boolean = false;
  @Input() public needDetectOutside: boolean = true;
  @Input() public validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;

  @HostBinding('class.edited')
  protected isActive = false;
  protected focused = false;
  protected nodesExcluded: Array<HTMLElement> = [];

  protected control = new FormControl('', this.validatorOrOpts);

  protected abstract createToggleEvent: () => ToggleEvent;
  protected abstract handleStateChange: () => void;
  protected abstract resetToDefaultState: () => void;
  protected abstract saveChanges: () => void;

  constructor (
    private cdRef: ChangeDetectorRef,
    private elem: ElementRef
  ) { }

  ngOnInit() {
    this.control = new FormControl('', this.validatorOrOpts);
  }

  @HostListener('click')
  public onClick() {
    if (!this.active) {
      this.active = true;
    }
  }

  @HostListener('document:click', ['$event'])
  public onClickAnywhere (event: Event) {
    if (this.needDetectOutside) {
      if (this.needExclude) {
        this.excludeCheck();
      }

      if (this.active && !this.elem.nativeElement.contains(event.target) && !this.shouldExclude(event.target)) {
        event.preventDefault();
        this.active = false;
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    if (this.isActive && this.focused) {
      if (event.keyCode === keycode.escape) {
        this.resetToDefaultState();
      }
      if (event.keyCode === keycode.enter) {
        this.saveChanges();
      }
    }
  }

  @Input()
  public get active() {
    return this.isActive;
  }

  public set active(value: boolean) {
    if (value !== this.isActive) {
      this.isActive = value;
      this.cdRef.markForCheck();
      this.handleStateChange();
      this.toggled.emit(this.createToggleEvent());
    }
  }

  public reset() {
    this.resetToDefaultState();
  }

  public save() {
    this.saveChanges();
  }

  private excludeCheck() {
    if (this.exclude) {
      try {
        const nodes = Array.from(document.querySelectorAll(this.exclude)) as Array<HTMLElement>;
        if (nodes) {
          this.nodesExcluded = nodes;
        }
      } catch (err) {
        console.error('[ng2-editable-custom] Check your exclude selector syntax.', err);
      }
    }
  }

  private shouldExclude(target): boolean {
    for (let excludedNode of this.nodesExcluded) {
      if (excludedNode.contains(target)) {
        return true;
      }
    }
    return false;
  }
}
