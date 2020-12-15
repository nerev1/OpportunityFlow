import { LightningElement, track } from 'lwc';
import getAccountsBySearchKey from '@salesforce/apex/AccountController.getAccountsBySearchKey';

export default class AccountForm extends LightningElement {
  @track accounts;
  @track accountOptions;
  @track searchKey = '';
  @track error;
  @track selectedAccountId;

  connectedCallback() {
    this.updateAccounts();
  }

  disconnectedCallback() {
    this.searchKey = '';
  }
  
  handleChangeSearchKey(event) {
    this.searchKey = event.target.value;
    setTimeout(() => {
      this.updateAccounts()
    }, 1000);
  }

  handleChangeAccount(event) {
    this.selectedAccountId = event.target.value;
  }

  updateAccounts() {
    getAccountsBySearchKey({searchKey: this.searchKey})
      .then(result => {
        this.error = undefined;
        this.accounts = result;
      })
      .then(() => {
        this.updateAccountOptions();
      })
      .catch(error => {
        this.error = error;
        this.accounts = undefined;
      });
  }

  updateAccountOptions() {
    let accountOptions = [];
    this.selectedAccountId = undefined;
    this.accounts.forEach(account => {
      accountOptions.push({
        label: account.Name,
        value: account.Id
      });
    });
    this.accountOptions = accountOptions;
  }
}