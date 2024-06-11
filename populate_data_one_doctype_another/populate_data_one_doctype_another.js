frappe.ui.form.on('Sales Invoice', {
	refresh: function(frm) {
		if (frm.doc.docstatus == 1) {
		    frm.add_custom_button(__("Invoice Data"), () => {
		      //  frappe.msgprint("Clicked");
		      frappe.new_doc("Invoice Data", {}, inv => {
		          inv.sales_invoice_id = frm.doc.name;
		          inv.customer = frm.doc.customer;
		          inv.company = frm.doc.company;
		          inv.invoice_date = frm.doc.posting_date;
		          
		          frm.doc.items.forEach(invoice_item => {
		              let inv_item = frappe.model.add_child(inv, 'invoice_items');
		              inv_item.item_code = invoice_item.item_code;
		              inv_item.item_name = invoice_item.item_name;
		              inv_item.qty = invoice_item.qty;
		              inv_item.uom = invoice_item.uom;
		              inv_item.rate = invoice_item.rate;
		              inv_item.amount = invoice_item.amount;
		          });
		      });
		    }, __("Create"));
		}
	}
});
