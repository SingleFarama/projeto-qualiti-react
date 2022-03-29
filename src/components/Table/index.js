import { Table, Dropdown } from "react-bootstrap";

const TableComponent = ({ actions, columns = [], items = [], refetch }) => {
  if (!items.length) {
    return <h3>Não tem Nenhuma Informação para Mostrar</h3>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={`Head-${index}`}>{column.value}</th>
          ))}

          {actions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
      {items.map((item, index) => (
          <tr key={`Body-${index}`}>
            {columns.map((column, indexColumn) => {

              const value = checkState(item[column.id]);

              return (
                <td key={indexColumn}>
                  {column.render ? column.render(value) : value}
                </td>
              );


              function checkState(value){
                const item_column = value.toString();

                if(item_column.indexOf("+0000") !== -1){
                  return item_column.replace('+0000', '');
                }else{
                  return item[column.id]
                }
              }
            })}
            {actions && (
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    Actions
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {actions.map((action) => (
                      <Dropdown.Item
                        onClick={() => action.action(item, refetch)}
                      >
                        {action.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableComponent;
