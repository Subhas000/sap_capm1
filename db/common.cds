namespace photoapp.common;

using {Currency} from '@sap/cds/common';

type guid : UUID;
type PhoneNumber : String(32);
type Email : String(65);
type role : String(2);
type String32 : String(32);
type String64 : String(64);
type String225 : String(255);

type Gender : String(1) enum {
    male = 'M';
    female = 'F';
    undisclosed = 'D';
    
}

type AmountT : Decimal(10,2) @(
    Semantics.amount.CurrencyCode : 'CURRENCY_CODE',
    sap.unit : 'CURRENCT_CODE'
);
aspect Amount {
    GROSS_AMOUNT : AmountT;
    NET_AMOUNT : AmountT;
    TAX_AMOUNT: AmountT;
    CURRENCY : Currency;
}
aspect Address {
    STREET : String225;
    POSTAL_CODE : String(12);
    CITY : String225;
    COUNTRY : String225;
    BUILDING : String225;
}