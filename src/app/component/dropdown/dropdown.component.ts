import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {

    @Input() data: any;
    @Output() value = new EventEmitter<string>();


    onValueChange(item: any) {
        this.value.emit(item)
    }
}
