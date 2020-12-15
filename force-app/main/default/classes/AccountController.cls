public with sharing class AccountController {

  private static final String SOSL_EXCEPTION_MESSAGE = 'Error occured while search acount';
  private static final Integer ACCOUNT_LIST_SIZE = 10;
  private static final Integer LEAST_SEARCHKEY_SIZE = 2;

  @AuraEnabled(cacheable=true)
  public static List<Account> getAccountsBySearchKey(String searchKey){
    List<Account> accounts;
    try {
      if (searchKey.length() < LEAST_SEARCHKEY_SIZE) {
        accounts = [SELECT Name
                    FROM Account
                    WITH SECURITY_ENFORCED
                    ORDER BY Name
                    LIMIT :ACCOUNT_LIST_SIZE];
      } else {
        accounts = (List<Account>) [FIND :searchKey 
                    RETURNING Account(Name LIMIT :ACCOUNT_LIST_SIZE)][0];
      }
      return accounts;
    } catch (QueryException error) {
      throw new AuraHandledException(SOSL_EXCEPTION_MESSAGE);
    }
  }
}