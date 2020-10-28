import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import invoicesAPI from "../services/invoicesAPI";

/**
 * CONST to handles buttons color and
 * translation from English to French
 */
const STATUS_CLASSES = {
  PAID: "success",
  SENT: "info",
  CANCELLED: "danger",
};

const STATUS_TRANSLATION = {
  PAID: "Payée",
  SENT: "Envoyée",
  CANCELLED: "Annulée",
};

const InvoicesPage = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const itemsPerPage = 30;

  /**
   * API Call to get all invoices data
   */
  const fetchInvoices = async () => {
    try {
      const data = await invoicesAPI.findAll();
      setInvoices(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  /**
   * Gets all invoices on component loading
   */
  useEffect(() => {
    fetchInvoices();
  }, []);

  /**
   * Sets the current page number
   *
   * @param {integer} page - the current page number
   */
  const handlePageChanged = (page) => setCurrentPage(page);

  /**
   * Gets the current submitted value and sets it using the hook
   *
   * @param {object} event - current event
   */
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  /**
   * Function that handles all the logic to delete a invoice
   * Deleted invoice will disappear from the page on click, but
   * will eventually be displayed again in case API returns an error
   *
   * @param {integer} id - the invoice id
   */
  const handleDelete = async (id) => {
    const originalInvoices = [...invoices];
    setInvoices(invoices.filter((invoice) => invoice.id != id));

    try {
      await invoicesAPI.delete(id);
    } catch (error) {
      console.log(error);
      setInvoices(originalInvoices);
    }
  };

  /**
   * Format the sentAt date into a proper date using moment.js
   *
   * @param {string} str - the sentAt of the invoice
   */
  const formatDate = (str) => moment(str).format("DD/MM/YYYY");

  /**
   * Filters the invoices based on the searched value
   */
  const filteredInvoices = invoices.filter(
    (i) =>
      STATUS_TRANSLATION[i.status]
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      i.amount.toString().toLowerCase().startsWith(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.firstName.toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Number of invoices that will be displayed on the page.
   * Result is provided by the Pagination property "getData".
   */
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des factures</h1>

      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher..."
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>
                <a href="#">
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </a>
              </td>
              <td className="text-center">{formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                >
                  {STATUS_TRANSLATION[invoice.status]}
                </span>
              </td>
              <td className="text-center">{invoice.amount.toLocaleString()}</td>
              <td>
                <button className="btn btn-sm btn-primary mr-1">Editer</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(invoice.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={filteredInvoices.length}
        onPageChanged={handlePageChanged}
      />
    </>
  );
};

export default InvoicesPage;
