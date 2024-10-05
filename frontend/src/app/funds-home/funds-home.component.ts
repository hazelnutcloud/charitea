import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-funds-home',
  templateUrl: './funds-home.component.html',
  styleUrl: './funds-home.component.css'
})
export class FundsHomeComponent {
  searchQuery: string = '';
  filterPlace: string = '';
  isFilterVisible: boolean = false;
  isShowFundsPopup: boolean = false;

  funds = [
    { title: 'Institution A', description: 'city1', image: './assets/cover/masjidzahir.jpg' },
    { title: 'Institution B', description: 'city2', image: './assets/cover/masjidzahir.jpg' },
    { title: 'Institution C', description: 'city1', image: './assets/cover/masjidzahir.jpg' },
    { title: 'Institution D', description: 'city3', image: './assets/cover/masjidzahir.jpg' },
    { title: 'Institution E', description: 'city3', image: './assets/cover/masjidzahir.jpg' },
    { title: 'Institution F', description: 'city2', image: './assets/cover/masjidzahir.jpg' },
    { title: 'Institution G', description: 'city2', image: './assets/cover/masjidzahir.jpg' },
  ];

// Toggle filter popup visibility
  toggleFilterPopup() {
    this.isFilterVisible = !this.isFilterVisible;
  }
// Method to apply the filter
  applyFilter() {
    this.toggleFilterPopup(); // Close the popup when filter is applied
  }
// Method to filter institutions based on search query (name) and filter option (place)
  filteredFunds() {
    return this.funds.filter(fund => {
      const matchesSearch = fund.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesPlace = this.filterPlace === '' || fund.description === this.filterPlace;
      return matchesSearch && matchesPlace;
    });
  }

// Method to open Add Funds Popup Modal
  openAddFunds() {
    this.isShowFundsPopup = true;  // Set to true to show the modal
  }

  // Method to close Add Funds Popup Modal
  closeAddFunds() {
    this.isShowFundsPopup = false;  // Set to false to hide the modal
  }
}
