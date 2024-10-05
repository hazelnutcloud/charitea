import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-funds',
  templateUrl: './add-funds.component.html',
  styleUrl: './add-funds.component.css'
})
export class AddFundsComponent {
  @Output() close = new EventEmitter<void>();  // Emits event to close the modal

  fundData = {
    title: '',
    description: '',
    amount: 0
  };

  // Method to close the modal
  closeModal() {
    this.close.emit();  // Emit the close event
  }

  // Method to submit the form
  submitFunds() {
    console.log('Form submitted:', this.fundData);
    this.closeModal();  // Close modal after submission
  }
}
