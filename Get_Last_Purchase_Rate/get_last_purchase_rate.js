frappe.ui.form.on('Purchase Order Item', {
	item_code: function(frm, cdt, cdn) {
		let item = locals[cdt][cdn];
		if (frm.doc.supplier && item.item_code) {
		    frappe.call({
		       method: 'get_last_purchase_rate',
		       args: {
		           'supplier': frm.doc.supplier,
		           'item_code': item.item_code
		       },
		       callback: function(r) {
		           if (r.message) {
		               let data = r.message;
		              // console.log("--------------", data);
		              show_rate_dialog(frm, item, data);
		           }
		       }
		    });
		}
	}
});

function show_rate_dialog(frm, item, data) {
    
    let fields = [{
        fieldname: 'rates',
        fieldtype: 'Table',
        cannot_add_rows: true,
        cannot_delete_rows: true,
        in_place_edit: true,
        fields: [
            {
                label: 'Purchase Order',
                fieldname: 'name',
                fieldtype: 'Link',
                options: 'Purchase Order',
                in_list_view: 1,
                read_only: 1,
                columns: 3
            },
            {
                label: 'Date',
                fieldname: 'transaction_date',
                fieldtype: 'Date',
                in_list_view: 1,
                read_only: 1,
                columns: 2
            },
            {
                label: 'Last Purchase Rate',
                fieldname: 'rate',
                fieldtype: 'Currency',
                in_list_view: 1,
                read_only: 1,
                columns: 3
            }
        ],
        data: data,
    }];
    
    let d = new frappe.ui.Dialog({
        title: '<b>'+ item.item_code +'</b> Last Purchase Rate of <b>'+ frm.doc.supplier + '</b>',
        size: 'large',
        fields: fields,
        primary_action_label: 'Select',
        primary_action(value) {
            // console.log("-------------", value);
            let selected_items = d.fields_dict.rates.grid.get_selected_children();
            if (selected_items.length > 1) {
                frappe.throw("You can only select the one row for get the Last Purchase Rate");
            } else {
                frappe.model.set_value(item.doctype, item.name, 'rate', selected_items[0].rate);
            }
            d.hide();
        }
        
    });
    d.show();
}
