import {
    Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';

import { EditableComponent } from './editable.component';

@Component({
    moduleId: 'ng2-editable-custom',
    selector: 'ng2-input-editable',
    template: `
    {{isActive ? '' : text}}
    <input type="text" *ngIf="isActive" [(ngModel)]="text">
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputEditableComponent extends EditableComponent {

    @Input() public text = '';
    @Output() public textChange = new EventEmitter<string>();

    private _originalText = '';

    constructor (
        cdRef: ChangeDetectorRef,
        elem: ElementRef
    ) {
        super(cdRef, elem);
    }

    protected _createToggleEvent = () => ({
        isActive: this.isActive,
        isChanged: this.text !== this._originalText
    })

    protected _handleStateChange = () => {
        if (this.isActive) {
            this._originalText = this.text;
        } else {
            if (this.text !== this._originalText) {
                this.textChange.emit(this.text);
            }
        }
    }

}
