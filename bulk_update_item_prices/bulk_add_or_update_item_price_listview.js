frappe.listview_settings["Item"] = {
    
    onload: function(listview) {
        listview.page.add_action_item(__('<i class="fa fa-edit"></i> Prices'), () => {
            console.log("--Action Clicked--");
            let checked_items = listview.get_checked_items(true);
            console.log("--checked_items--", checked_items);

            frappe.db.get_list('Item Price', {
                fields: ['name', 'item_name', 'price_list', 'price_list_rate'],
                filters: {
                    item_code: ['IN', checked_items]
                },
                limit: null
            }).then(function(prices) {
                console.log("Item Prices: ", prices);
                let d = new frappe.ui.Dialog({
                    title: 'Bulk Update Item Prices',
                    fields: [{
                        label: 'Item Price Table',
                        fieldname: 'prices_table',
                        fieldtype: 'Table',
                        cannot_add_rows: 1,
                        cannot_delete_rows: 1,
                        // in_place_edit: 1,
                        fields: [
                            {
                                label: 'Name',
                                fieldname: 'name',
                                fieldtype: 'Data',
                                hidden: 1,
                            },
                            {
                                label: 'Item Name',
                                fieldname: 'item_name',
                                fieldtype: 'Data',
                                read_only: 1,
                                in_list_view: 1,
                            },
                            {
                                label: 'Price List',
                                fieldname: 'price_list',
                                fieldtype: 'Link',
                                options: "Price List",
                                read_only: 1,
                                in_list_view: 1,
                            },
                            {
                                label: 'Price List Rate',
                                fieldname: 'price_list_rate',
                                fieldtype: 'Currency',
                                in_list_view: 1,
                            }
                        ],
                        data: prices
                    }, ],
                    size: 'large', // small, large, extra-large 
                    primary_action_label: 'Update Price',
                    primary_action: function() {
                        var data = d.get_values().prices_table;
                        console.log("Update Price Data", data);
                        if (data) {
                            var updated = false;
                            data.forEach(function(price) {
                                frappe.call({
                                    method: "frappe.client.set_value",
                                    args: {
                                        doctype: "Item Price",
                                        name: price.name,
                                        fieldname: 'price_list_rate',
                                        value: price.price_list_rate
                                    },
                                    callback: function(response) {
                                        if (!updated && !response.exc) {
                                            updated = true;
                                            frappe.msgprint(__('Item prices updated successfully'));
                                        }
                                    }
                                });
                            });
                        }
                        d.hide();
                    },
                    secondary_action_label: __("Add Price"),
                    secondary_action: function() {
                        d.hide();
                        let add_dialog = new frappe.ui.Dialog({
                            title: 'Add Item Prices',
                            fields: [{
                                label: 'Add Item Price Table',
                                fieldname: 'add_prices_table',
                                fieldtype: 'Table',
                                // cannot_add_rows: 1,
                                // cannot_delete_rows: 1,
                                // in_place_edit: 1,
                                fields: [
                                    {
                                        label: 'Item Code',
                                        fieldname: 'item_code',
                                        fieldtype: 'Link',
                                        options: "Item",
                                        // read_only: 1,
                                        in_list_view: 1,
                                    },
                                    {
                                        label: 'Price List',
                                        fieldname: 'price_list',
                                        fieldtype: 'Link',
                                        options: "Price List",
                                        // read_only: 1,
                                        in_list_view: 1,
                                    },
                                    {
                                        label: 'Price List Rate',
                                        fieldname: 'price_list_rate',
                                        fieldtype: 'Currency',
                                        in_list_view: 1,
                                    }
                                ],
                            }, ],
                            size: 'large', // small, large, extra-large 
                            primary_action_label: 'Save',
                            primary_action: function() {
                                var add_data = add_dialog.get_values().add_prices_table;
                                
                                if (add_data && add_data.length > 0) {
                                    console.log("Update Price Data", add_data);
                                    var updated = false;
                                    add_data.forEach(function(price) {
                                        frappe.call({
                                            method: "frappe.client.insert",
                                            args: {
                                                doc: {
                                                    doctype: "Item Price",
                                                    item_code: price.item_code,
                                                    price_list: price.price_list,
                                                    price_list_rate: price.price_list_rate
                                                },
                                                callback: function(response) {
                                                    if (!updated && !response) {
                                                        updated = true;
                                                        frappe.msgprint(__('Item Prices added successfully.'));
                                                    }
                                                }
                                            }
                                        });
                                    });
                                    add_dialog.hide();
                                } else {
                                    frappe.msgprint("Please add ad least one Item Price.");
                                }
                            }
                        });
                        add_dialog.show();
                    },
                });
                d.show();
            });
        });
    },
};
