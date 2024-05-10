frappe.ui.form.on('Sales Invoice', {
	refresh: function(frm) {
		frm.add_custom_button(("DC attachments"), () => {
		    frappe.call({
		        method: 'get_dc_attachments_in_invoice',
		        args: {
		            invoice_id: frm.doc.name
		        },
		        callback: function(response) {
		            if (response.message) {
		                console.log("---------", response.message);
		                frm.reload_doc();
		            } else {
		                frappe.msgprint("Error: No Response received");
		            }
		        }
		    });
		}, ("Get"));
	}
});
