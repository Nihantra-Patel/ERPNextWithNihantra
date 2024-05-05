frappe.listview_settings["Item"] = {
    hide_name_column: true,
    add_fields: ["item_code"],

    button: {
        show: function(doc) {
            return '<i class="fa fa-edit"></i> Prices';
        },
        get_label: function() {
            return __('<i class="fa fa-edit"></i> Prices', null, "Access");
        },
        get_description: function(doc) {
            return __("Add/Edit Prices of " + doc.item_code);
        },
        action: function(doc) {
            console.log("Action Clicked 1");

            frappe.db.get_list('Item Price', {
                fields: ['name', 'item_name', 'price_list', 'price_list_rate'],
                filters: {
                    item_code: doc.item_code
                },
                limit: null
            }).then(function(prices) {
                console.log("Item Prices: ", prices);
                let d = new frappe.ui.Dialog({
                    title: doc.item_code + ': Item Prices',
                    fields: [{
                        label: 'Item Price Table',
                        fieldname: 'prices_table',
                        fieldtype: 'Table',
                        cannot_add_rows: 1,
                        cannot_delete_rows: 1,
                        in_place_edit: 1,
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
                                            frappe.msgprint(__('Item: <b>' + doc.item_code + '</b> prices updated successfully'));
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
                        frappe.new_doc("Item Price", {
                            item_code: doc.item_code
                        });
                    },
                });
                d.show();
            });
        },
    },
    
    refresh: function(listview) {
        $("button.btn.btn-action.btn-default.btn-xs").addClass("btn-info").removeClass("btn-default");
    }
};
