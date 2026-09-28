const cds = require('@sap/cds');
const { request } = require('hdb/lib/protocol');
const { uuid, exists, isdir, decodeURI, mkdir, read } = cds.utils;

module.exports = cds.service.impl(async function () {

    const { EmployeeSrv, ProductSrv, PurchaseItemSrv} = this.entities;

    this.before('UPDATE', EmployeeSrv, async(request, response)=> {
        const salaryAmt = request.data.salaryAmount;
        if (salaryAmt > 100000) {
            request.error(500,'Please get the approval from your line manager.')
        }
    })

    this.before('UPDATE', EmployeeSrv, async (request) => {
 
    const mobile = request.data.phoneNumber;
 
    if (mobile && !(mobile.startsWith('+1') || mobile.startsWith('+44'))) {
        request.error(400, 'Cannot update mobile number');
    }
 
});

    // Create Employee
    this.on("createEmployee", async (request) => {

        const empData = request.data;
        const objTransaction = cds.tx(request);

        let returnData = await objTransaction.run(
            INSERT.into(EmployeeSrv).entries(empData)
        )
        .then((resolve) => {
            if (resolve) {
                return request.data;
            } else {
                request.error(500, "Error in inserting data into the database");
            }
        })
        .catch(err => {
            request.error(500, `There is an error: ${err.message}`);
        });

        return returnData;
    });
    

    this.before('UPDATE', ProductSrv, async (request) => {
    const price = request.data.PRICE;

    if (price > 100000) {
        request.error(500,'Please get approval from your manager before updating a product with price greater than 100000.');
    }
});

    // Create Product
    this.on("createProduct", async (request) => {

        const proData = request.data;
        const objTransaction = cds.tx(request);

        let returnData = await objTransaction.run(
            INSERT.into(ProductSrv).entries(proData)
        )
        .then((resolve) => {

            if (resolve) {
                return request.data;
            } else {
                request.error(500, "Error in inserting data into the database");
            }

        })
        .catch(err => {
            request.error(500, `There is an error: ${err.message}`);
        });

        return returnData;
    });


    // Update Employee
    this.on('updateEmployee', async (request) => {

        const {
            ID,
            salaryAmount,
            Currency_code
        } = request.data;

        try {

            const objTransaction = cds.tx(request);

            await objTransaction.update(EmployeeSrv)
                .with({
                    salaryAmount: salaryAmount,
                    Currency_code: Currency_code
                })
                .where({
                    ID: ID
                });

            return "Successfully updated.";

        } catch (error) {

            request.error(500, error.message);

        }
    });


    // Update Product
    this.on('updateProduct', async (request) => {

        const {
            NODE_KEY,
            PRICE,
            CURRENCY_CODE
        } = request.data;

        try {

            const objTransaction = cds.tx(request);

            await objTransaction.update(ProductSrv)
                .with({
                    PRICE: PRICE,
                    CURRENCY_CODE: CURRENCY_CODE
                })
                .where({
                    NODE_KEY: NODE_KEY
                });

            return {
                message: "Successfully updated.",
                NODE_KEY,
                PRICE,
                CURRENCY_CODE
            };

        } catch (error) {

            request.error(500, error.message);

        }
    });


    // Delete Employee
    this.on('deleteEmployee', async (request) => {

        const { ID } = request.data;

        try {

            const objTransaction = cds.tx(request);

            await objTransaction.delete(EmployeeSrv)
                .where({
                    ID: ID
                });

            return "Successfully deleted";

        } catch (error) {

            request.error(500, error.message);

        }
    });
    //Implementation of custom Function
    this.on('getHighestSalariedEmployees', async (request, response) => {
    try {

        // Step 1: Create a transaction object
        const transaction = cds.tx(request);

        // Step 2: Read employees and sort by salary in descending order
        const response = await transaction
            .read(EmployeeSrv)
            .orderBy({
                salaryAmount: 'desc'
            })
            .limit(10);

        // Step 3: Return top 10 highest salaried employees
        return response;

    } catch (error) {
        request.error("Error : ", error);
    }
});

// Implementation of custom Function
this.on('getHeighestPricedProduct', async (request, response) => {
    try {

        // Step 1: Create a transaction object
        const transaction = cds.tx(request);

        // Step 2: Read products and sort by price in descending order
        const response = await transaction
            .read(ProductSrv)
            .orderBy({
                PRICE: 'desc'
            })
            .limit(10);

        // Step 3: Return top 10 highest priced products
        return response;

    } catch (error) {
        request.error("Error : ", error);
    }
});

        // Discount Purchase Order
    this.on('discountPrice', async (request) => {

        try {

            const ID = request.params[0];

            const transaction = cds.tx(request);

            await transaction.update(PurchaseOrderSrv)
                .with({
                    GROSS_AMOUNT: { '-=': 1000 },
                    NET_AMOUNT: { '-=': 800 },
                    TAX_AMOUNT: { '-=': 200 }
                })
                .where(ID);

            const updatePOInfo =
                await transaction.read(PurchaseOrderSrv)
                    .where(ID);

            return updatePOInfo;

        } catch (error) {

            return "Error : " + error.toString();

        }

    });


    // Largest Order Function
    this.on('largestOrder', async (request) => {

        try {

            const transaction = cds.tx(request);

            const reply = await transaction
                .read(PurchaseOrderSrv)
                .orderBy({
                    GROSS_AMOUNT: 'desc'
                })
                .limit(5);

            return reply;

        } catch (error) {

            return "Error : " + error.toString();

        }

    });


    // Increase Product Price by 10%
    this.on('increasePrice', ProductSrv, async (request) => {

        try {

            const { NODE_KEY } = request.params[0];

            const transaction = cds.tx(request);

            const product = await transaction
                .read(ProductSrv)
                .where({ NODE_KEY });

            if (!product.length) {
                return request.error(
                    404,
                    "Product not found"
                );
            }

            const newPrice =
                Number(product[0].PRICE) * 1.10;

            await transaction
                .update(ProductSrv)
                .with({
                    PRICE: newPrice
                })
                .where({ NODE_KEY });

            const updatedProductPrice =
                await transaction.read(ProductSrv)
                    .where({ NODE_KEY });

            return updatedProductPrice;

        } catch (error) {

            return "Error : " + error.toString();

        }

    });


    // Increase Employee Salary by 15%
    this.on('increaseSalary', EmployeeSrv, async (request) => {

        try {

            const { ID } = request.params[0];

            const transaction = cds.tx(request);

            const employee = await transaction
                .read(EmployeeSrv)
                .where({ ID });

            if (!employee.length) {

                return request.error(
                    404,
                    "Employee not found"
                );

            }

            const newSalary =
                Number(employee[0].salaryAmount) * 1.15;

            await transaction
                .update(EmployeeSrv)
                .with({
                    salaryAmount: newSalary
                })
                .where({ ID });

            const updatedEmployee =
                await transaction.read(EmployeeSrv)
                    .where({ ID });

            return updatedEmployee;

        } catch (error) {

            return request.error(
                500,
                error.message
            );

        }

    });
    this.on('top20HighestPaid', async (request, response) => {

    const transaction = cds.tx(request);

    return await transaction
        .read(EmployeeSrv)
        .orderBy({
            salaryAmount: 'desc'
        })
        .limit(20);

});

    this.on('getUtilities', async (request, response) => {

        let vUUID = uuid(),
            vPackageContent = null,
            vInput = "%E%A4%A",
            uri,
            dirExists = false,
            isFileExists = false;

        // Check file existence
        if (exists('srv/request.http')) {
            isFileExists = true;
        }

        // Check directory existence
        if (isdir('app')) {
            dirExists = true;
        }

        // Decode URI
        try {
            uri = decodeURI(vInput);

            // Create directory
            await mkdir('srv/lib');
        } catch (err) {
            uri = vInput;
        }

        // Read package.json
        vPackageContent = await read('package.json');

        return {
            uuid: vUUID,
            uri: uri,
            isFileExists: isFileExists,
            dirExists: dirExists,
            packageInfo: vPackageContent
        };
    });

});

