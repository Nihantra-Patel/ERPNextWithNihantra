frappe.ui.form.on('Invoice Data', {
	refresh: function(frm) {
		frm.add_custom_button(__("Sales Invoice"), () => {
		    if (frm.doc.customer) {
		        frm.clear_table('invoice_items');
		      //  frappe.msgprint("Customer selected");

                // MultiSelectDialog for individual child selection
                new frappe.ui.form.MultiSelectDialog({
                    doctype: "Sales Invoice",
                    target: cur_frm,
                    setters: {
                        posting_date: null,
                        // status: null,
                        customer: frm.doc.customer
                    },
                    add_filters_group: 1,
                    date_field: "posting_date",
                    allow_child_item_selection: 1,
                    child_fieldname: "items", // child table fieldname, whose records will be shown &amp; can be filtered
                    child_columns: ["item_code", "item_name", "qty"], // child item columns to be displayed
                    get_query() {
                        return {
                            filters: { docstatus: ['=', 1] }
                        }
                    },
                    action(selections, args) {
                        // console.log(selections); // list of selected item names
                        // console.log(args.filtered_children);
                        selections.forEach(function(si_id) {
                            if (si_id) {
                                frappe.call({
                                    method: 'frappe.client.get',
                                    args: {
                                        doctype: "Sales Invoice",
                                        filters: {
                                            name: si_id
                                        }
                                    },
                                    callback: function(r) {
                                        if (r.message) {
                                            r.message.items.forEach(function(item) {
                                                var si_items = args.filtered_children;
                                                if (si_items.length) {
                                                    // frappe.msgprint("Items selected")
                                                    si_items.forEach(function(si_itm) {
                                                        if (si_itm == item.name) {
                                                            // frappe.msgprint("Items selected", item.name);
                                                            insert_items(frm, item, si_id);
                                                        }
                                                    })
                                                } else {
                                                    insert_items(frm, item, si_id);
                                                }
                                            });
                                            frm.refresh_field('invoice_items');
                                        }
                                    }
                                });
                                
                            }
                        });

                    cur_dialog.hide();
                    }
                });

		    } else {
		        frappe.throw("Please, first select the customer");
		    }
		}, __("Get Items From"));
	}
});

function insert_items(frm, item, si_id) {
    var child = frm.add_child('invoice_items');
    child.item_code = item.item_code;
    child.item_name = item.item_name;
    child.qty = item.qty;
    child.uom = item.uom;
    child.rate = item.rate;
    child.amount = item.amount;
    child.sales_invoice = si_id;
}
