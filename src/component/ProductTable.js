import React from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
const ProductTable = ({ header, productList, deleteItem, openEditForm }) => {
  return (
    <div className="overflow-x">
      {productList?.length > 0 ? (
        <Table striped bordered hover>
          <thead className="table-header">
            <tr>
              {header.map((title, index) => (
                <th key={index}>{title}</th>
              ))}
            </tr>
          </thead>
            {productList?.map((item, index) => (
              <tbody className="table-data" key={index}>
                <tr>
                  <td>{index}</td>
                  <td>{item.sku}</td>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()}</td>
                  <td>
                    {Object.keys(item.stock).map((size, index) => (
                      <div key={index}>
                        {size}:{item.stock[size]}
                      </div>
                    ))}
                  </td>
                  <td>
                    <img src={item.image} width={100} alt={item.image} />
                  </td>
                  <td>{item.status}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteItem(item._id)}
                      className="product-table-delete-btn"
                    >
                      삭제
                    </Button>
                    <Button size="sm" onClick={() => openEditForm(item)}>
                      수정
                    </Button>
                  </td>
                </tr>
              </tbody>
            ))}
        </Table>
        ) : (
        <div className="empty">
          <h3>조회된 상품이 없습니다.</h3>
        </div>
        )}
    </div>
  );
};
export default ProductTable;
