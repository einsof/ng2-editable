import { Output, Input, EventEmitter, ElementRef, ChangeDetectorRef, HostListener, HostBinding } from '@angular/core';
import { ToggleEvent } from './models';

export abstract class EditableComponent {

  @Output() public toggled = new EventEmitter<ToggleEvent>();

  @Input() exclude: string = '';
  @Input() needExclude: boolean = false;

  @HostBinding('class.edited')
  private isActive = false;
  private nodesExcluded: Array<HTMLElement> = [];
  private needEmit = false;

  protected abstract createToggleEvent: () => ToggleEvent;
  protected abstract handleStateChange: () => void;
  protected abstract resetToDefaultState: () => void;

  constructor (
    private cdRef: ChangeDetectorRef,
    private elem: ElementRef
  ) { }

  @HostListener('click')
  public onClick() {
    if (!this.active) {
      this.needEmit = true;
      this.active = true;
    }
  }

  @HostListener('document:click', ['$event'])
  public onClickAnywhere (event: Event) {
    if (this.needExclude) {
      this.excludeCheck();
    }

    if (this.active && !this.elem.nativeElement.contains(event.target) && !this.shouldExclude(event.target)) {
      event.preventDefault();
      this.needEmit = true;
      this.active = false;
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
      this.emitEvent();
    }
  }

  public reset() {
    this.resetToDefaultState();
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

  private emitEvent() {
    if(this.needEmit) {
      this.toggled.emit(this.createToggleEvent());
    }
    this.needEmit = false;
  }

}
