using { photoapp.db as database } from '../db/schema';
using { photoapp.common as common } from '../db/common';

service CatalogServices {

    
    @Capabilities : {
    InsertRestrictions.Insertable : true,
    UpdateRestrictions.Updatable : true,
    DeleteRestrictions.Deletable : true,
    ReadRestrictions.Readable : true
}
    entity EmployeeSrv as projection on database.Master.Employees {
        *
    }
        actions {   
       action increaseSalary() returns array of EmployeeSrv;
       function top20HighestPaid() returns array of EmployeeSrv;

        };
    

    entity ProductSrv as projection on database.Master.Products{
        *
    }actions{
        action increasePrice() returns array of ProductSrv;
 
        function top20product() returns array of ProductSrv;
    };

    entity BusinessPartnerSrv as projection on database.Master.BusinessPartners;

    entity AddressSrv as projection on database.Master.Addresses;


    // Transaction Data
    entity PurchaseOrderSrv as projection on database.transaction.PurchaseOrders{
        *
}
actions {
    // Declare instance bounded action
    action discountPrice() returns array of PurchaseOrderSrv;
  
    //Declare instance bounded function
    function largestOrder() returns array of PurchaseOrderSrv;
};

entity PurchaseItemSrv as projection on database.transaction.PurchaseItems;


    action createEmployee(
        Currency_code : String(3),
        ID            : UUID,
        accountNumber : common.String32,
        bankId        : String(16),
        bankName      : common.String64,
        email         : common.Email,
        gender        : common.Gender,
        language      : String(2),
        loginName     : String(16),
        nameFirst     : common.String64,
        nameInitials  : common.String64,
        nameLast      : common.String64,
        nameMiddle    : common.String64,
        phoneNumber   : common.PhoneNumber,
        salaryAmount  : common.AmountT
    ) returns array of EmployeeSrv;


    action createAdress(
        ADDRESS_TYPE : common.String32,
        BUILDING     : common.String64,
        CITY         : common.String64,
        COUNTRY      : common.String64,
        LATITUDE     : Decimal,
        LONGITUDE    : Decimal,
        NODE_KEY     : String(16),
        POSTAL_CODE  : String(16),
        STREET       : common.String64,
        VAL_END      : Date,
        VAL_START    : Date
    ) returns array of AddressSrv;


    action updateEmployee(
        ID            : UUID,
        salaryAmount  : common.AmountT,
        Currency_code : String(3)
    ) returns String;


    action createProduct(
        NODE_KEY       : common.guid,
        PRODUCT_ID     : common.String32,
        TYPE_CODE      : String(2),
        CATEGORY       : common.String32,
        DESCRIPTION    : common.String225,
        TAX_TARIF_CODE : Integer,
        MEASURE_UNIT   : String(2),
        WEIGHT_MEASURE : Decimal(5,2),
        WEIGHT_UNIT    : String(2),
        PRICE          : Decimal(15,2),
        CURRENCY_CODE  : String(5),
        WIDTH          : Decimal(5,2),
        DEPTH          : Decimal(5,2),
        HEIGHT         : Decimal(5,2),
        DIM_UNIT       : String(2)
    ) returns array of ProductSrv;


    action updateProduct(
        NODE_KEY      : common.guid,
        PRICE         : Decimal(15,2),
        CURRENCY_CODE : String(5)
    ) returns String;


    action deleteEmployee(
        ID : UUID
    ) returns String;

    //Custom Function Declaration
    function getHighestSalariedEmployees() returns array of EmployeeSrv;

    //Custom Function Declaration
    function getHeighestPricedProduct() returns array of ProductSrv;

    function getUtilities() returns String;

}