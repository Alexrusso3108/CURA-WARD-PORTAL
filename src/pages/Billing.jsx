import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import BillModal from '../components/BillModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Plus, Search, Filter, Eye, Edit2, Trash2, 
  DollarSign, FileText, CheckCircle, XCircle, Printer
} from 'lucide-react';
import { format } from 'date-fns';

const Billing = () => {
  const { 
    patients, bills, payments, 
    fetchBills, fetchBillItems, fetchPayments,
    createBill, updateBill, deleteBill, 
    addPayment, finalizeBill, loading 
  } = useApp();

  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedBillItems, setSelectedBillItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [billData, setBillData] = useState({
    patientId: '',
    admissionDate: '',
    dischargeDate: '',
    dueDate: '',
    taxPercentage: 0,
    discountPercentage: 0,
    notes: '',
    createdBy: '',
    status: 'Draft'
  });

  const [billItems, setBillItems] = useState([{
    itemType: 'Room Charges',
    itemName: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    amount: 0
  }]);

  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'Cash',
    transactionId: '',
    referenceNumber: '',
    notes: '',
    receivedBy: ''
  });

  useEffect(() => {
    if (fetchBills) fetchBills();
    if (fetchPayments) fetchPayments();
  }, []);

  const handleOpenModal = (bill = null) => {
    if (bill) {
      setEditingBill(bill);
      setBillData({
        patientId: bill.patientId,
        admissionDate: bill.admissionDate || '',
        dischargeDate: bill.dischargeDate || '',
        dueDate: bill.dueDate || '',
        taxPercentage: bill.taxPercentage || 0,
        discountPercentage: bill.discountPercentage || 0,
        notes: bill.notes || '',
        createdBy: bill.createdBy || '',
        status: bill.status
      });
      // Fetch bill items
      fetchBillItems(bill.id).then(result => {
        if (result.success) {
          setBillItems(result.data.length > 0 ? result.data : [{
            itemType: 'Room Charges',
            itemName: '',
            description: '',
            quantity: 1,
            unitPrice: 0,
            amount: 0
          }]);
        }
      });
    } else {
      setEditingBill(null);
      setBillData({
        patientId: '',
        admissionDate: '',
        dischargeDate: '',
        dueDate: '',
        taxPercentage: 0,
        discountPercentage: 0,
        notes: '',
        createdBy: '',
        status: 'Draft'
      });
      setBillItems([{
        itemType: 'Room Charges',
        itemName: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0
      }]);
    }
    setIsModalOpen(true);
  };

  const handleViewBill = async (bill) => {
    setSelectedBill(bill);
    const result = await fetchBillItems(bill.id);
    if (result.success) {
      setSelectedBillItems(result.data);
    }
    setIsViewModalOpen(true);
  };

  const handleOpenPaymentModal = (bill) => {
    setSelectedBill(bill);
    setPaymentData({
      amount: bill.balanceAmount || '',
      paymentMethod: 'Cash',
      transactionId: '',
      referenceNumber: '',
      notes: '',
      receivedBy: ''
    });
    setIsPaymentModalOpen(true);
  };

  const addBillItem = () => {
    setBillItems([...billItems, {
      itemType: 'Room Charges',
      itemName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0
    }]);
  };

  const removeBillItem = (index) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const updateBillItem = (index, field, value) => {
    const updated = [...billItems];
    updated[index][field] = value;
    
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = parseFloat(updated[index].quantity) || 0;
      const price = parseFloat(updated[index].unitPrice) || 0;
      updated[index].amount = qty * price;
    }
    
    setBillItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = editingBill
        ? await updateBill(editingBill.id, billData, billItems)
        : await createBill(billData, billItems);
      
      if (result.success) {
        setIsModalOpen(false);
        alert(`Bill ${editingBill ? 'updated' : 'created'} successfully!`);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await addPayment({
        billId: selectedBill.id,
        patientId: selectedBill.patientId,
        ...paymentData
      });
      
      if (result.success) {
        setIsPaymentModalOpen(false);
        alert('Payment recorded successfully!');
        fetchBills();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalize = async (billId) => {
    if (window.confirm('Finalize this bill? You cannot edit it after finalization.')) {
      const result = await finalizeBill(billId);
      if (!result.success) {
        alert('Error finalizing bill: ' + result.error);
      }
    }
  };

  const handleDelete = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      const result = await deleteBill(billId);
      if (!result.success) {
        alert('Error deleting bill: ' + result.error);
      }
    }
  };

  const handlePrint = (bill) => {
    window.print();
  };

  const filteredBills = bills.filter(bill => {
    const patient = patients.find(p => p.id === bill.patientId);
    const matchesSearch = patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || bill.paymentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Draft: 'bg-gray-100 text-gray-800',
      Finalized: 'bg-blue-100 text-blue-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadge = (status) => {
    const styles = {
      Unpaid: 'bg-red-100 text-red-800',
      'Partially Paid': 'bg-yellow-100 text-yellow-800',
      Paid: 'bg-green-100 text-green-800',
      Overdue: 'bg-orange-100 text-orange-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateTotals = () => {
    const subtotal = billItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const taxAmount = (subtotal * parseFloat(billData.taxPercentage || 0)) / 100;
    const discountAmount = (subtotal * parseFloat(billData.discountPercentage || 0)) / 100;
    const total = subtotal + taxAmount - discountAmount;
    return { subtotal, taxAmount, discountAmount, total };
  };

  if (loading) {
    return <LoadingSpinner message="Loading billing data..." />;
  }

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing Management</h1>
          <p className="text-gray-600 mt-1">Manage patient bills and payments</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create Bill</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or bill number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="All">All Status</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.map((bill) => {
                const patient = patients.find(p => p.id === bill.patientId);
                return (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bill.billNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(bill.billDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{parseFloat(bill.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      ₹{parseFloat(bill.paidAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      ₹{parseFloat(bill.balanceAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(bill.status)}`}>
                          {bill.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadge(bill.paymentStatus)}`}>
                          {bill.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleViewBill(bill)} className="text-blue-600 hover:text-blue-900" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handlePrint(bill)} className="text-gray-600 hover:text-gray-900" title="Print">
                          <Printer className="w-4 h-4" />
                        </button>
                        {bill.balanceAmount > 0 && (
                          <button onClick={() => handleOpenPaymentModal(bill)} className="text-green-600 hover:text-green-900" title="Add Payment">
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        {bill.status === 'Draft' && (
                          <>
                            <button onClick={() => handleOpenModal(bill)} className="text-primary-600 hover:text-primary-900" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleFinalize(bill.id)} className="text-green-600 hover:text-green-900" title="Finalize">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {bill.status === 'Draft' && (
                          <button onClick={() => handleDelete(bill.id)} className="text-red-600 hover:text-red-900" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBills.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No bills found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Bill Modal */}
      <BillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        billData={billData}
        setBillData={setBillData}
        billItems={billItems}
        setBillItems={setBillItems}
        addBillItem={addBillItem}
        removeBillItem={removeBillItem}
        updateBillItem={updateBillItem}
        patients={patients}
        editingBill={editingBill}
        submitting={submitting}
        totals={totals}
      />

      {/* View Bill Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Bill Details"
        size="lg"
      >
        {selectedBill && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Bill Number</label>
                <p className="text-gray-900 font-semibold">{selectedBill.billNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Patient</label>
                <p className="text-gray-900">{patients.find(p => p.id === selectedBill.patientId)?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Bill Date</label>
                <p className="text-gray-900">{format(new Date(selectedBill.billDate), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedBill.status)}`}>
                    {selectedBill.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadge(selectedBill.paymentStatus)}`}>
                    {selectedBill.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bill Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Price</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedBillItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.itemName}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{item.itemType}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">₹{parseFloat(item.unitPrice).toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">₹{parseFloat(item.amount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{parseFloat(selectedBill.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">₹{parseFloat(selectedBill.taxAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-red-600">-₹{parseFloat(selectedBill.discountAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-bold text-lg text-primary-600">₹{parseFloat(selectedBill.totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paid:</span>
                  <span className="font-medium text-green-600">₹{parseFloat(selectedBill.paidAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Balance:</span>
                  <span className="font-bold text-lg text-red-600">₹{parseFloat(selectedBill.balanceAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {selectedBill.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900">{selectedBill.notes}</p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button onClick={() => setIsViewModalOpen(false)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Payment"
        size="md"
      >
        {selectedBill && (
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Bill Number:</span>
                <span className="font-medium">{selectedBill.billNumber}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">₹{parseFloat(selectedBill.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Paid:</span>
                <span className="font-medium text-green-600">₹{parseFloat(selectedBill.paidAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="font-semibold">Balance Due:</span>
                <span className="font-bold text-lg text-red-600">₹{parseFloat(selectedBill.balanceAmount).toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="label">Payment Amount</label>
              <input
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                className="input-field"
                required
                min="0"
                max={selectedBill.balanceAmount}
                step="0.01"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="label">Payment Method</label>
              <select
                value={paymentData.paymentMethod}
                onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                className="input-field"
                required
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cheque">Cheque</option>
                <option value="Insurance">Insurance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Transaction ID (Optional)</label>
                <input
                  type="text"
                  value={paymentData.transactionId}
                  onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                  className="input-field"
                  placeholder="Transaction ID"
                />
              </div>
              <div>
                <label className="label">Reference Number (Optional)</label>
                <input
                  type="text"
                  value={paymentData.referenceNumber}
                  onChange={(e) => setPaymentData({...paymentData, referenceNumber: e.target.value})}
                  className="input-field"
                  placeholder="Reference #"
                />
              </div>
            </div>

            <div>
              <label className="label">Received By</label>
              <input
                type="text"
                value={paymentData.receivedBy}
                onChange={(e) => setPaymentData({...paymentData, receivedBy: e.target.value})}
                className="input-field"
                required
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="label">Notes (Optional)</label>
              <textarea
                value={paymentData.notes}
                onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                className="input-field"
                rows="2"
                placeholder="Additional notes"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Record Payment'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Billing;
