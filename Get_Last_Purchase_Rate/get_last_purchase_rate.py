supplier = frappe.form_dict.get('supplier')
item_code = frappe.form_dict.get('item_code')

rates = frappe.db.sql("""
    SELECT po.name, po.transaction_date, poi.rate
    FROM `tabPurchase Order Item` poi
    JOIN `tabPurchase Order` po ON poi.parent = po.name
    WHERE poi.item_code = %s AND po.supplier = %s
    ORDER BY po.transaction_date DESC
    LIMIT 5
""", (item_code, supplier), as_dict = 1)

frappe.response['message'] = rates
