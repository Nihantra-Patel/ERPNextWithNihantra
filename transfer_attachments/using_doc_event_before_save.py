processed_dcs = set()

for row in doc.get('items'):
    if row.delivery_note not in processed_dcs:
        processed_dcs.add(row.delivery_note)
        # frappe.errprint(row.delivery_note)
        
        dc_attachments = frappe.get_all("File", 
        filters= {
            'attached_to_doctype': "Delivery Note",
            'attached_to_name': row.delivery_note
        },
        fields=['file_name', 'file_url'])
        # frappe.errprint(dc_attachments)
        
        if dc_attachments:
            for attach in dc_attachments:
                have_attachment = frappe.db.get_value("File", {
                    'file_url': attach.file_url,
                    'attached_to_doctype': "Sales Invoice",
                    'attached_to_name': doc.name
                })
                frappe.errprint(have_attachment)
                if not have_attachment:
                    si_attach = frappe.get_doc({
                        'doctype': "File",
                        'file_name': attach.file_name,
                        'file_url': attach.file_url,
                        'attached_to_doctype': "Sales Invoice",
                        'attached_to_name': doc.name
                    })
                    si_attach.insert()
                    frappe.msgprint("DC attachments: <b>" + attach.file_name + "</b> attached successfully")
                    si_attach.reload()
                else:
                    frappe.msgprint("DC attachments: <b>" + attach.file_name + "</b> already attached")
