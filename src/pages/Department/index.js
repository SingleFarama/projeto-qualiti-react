import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";

const endpoint = "/departments";

const columns = [
  {
    value: "ID",
    id: "id",
  },
  {
    value: "Nome",
    id: "name",
  },
];

const INITIAL_STATE = { id: 0, name: "" };

const Departments = () => {
  const [visible, setVisible] = useState(false);
  const [department, setDepartments] = useState(INITIAL_STATE);

  const handleSave = async (refetch) => {
    try {
      if (department.id) {
        await api.put(`${endpoint}/${department.id}`, {
          name: department.name,
        });

        toast.success("Atualizado com sucesso!");
      } else {
        await api.post(endpoint, { name: department.name });

        toast.success("Cadastrado com sucesso!");
      }

      setVisible(false);

      await refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const actions = [
    {
      name: "Editar",
      action: (_department) => {
        setDepartments(_department);
        setVisible(true);
      },
    },
    {
      name: "Remover",
      action: async (item, refetch) => {
        if (window.confirm("Você tem certeza que deseja remover?")) {
          try {
            await api.delete(`${endpoint}/${item.id}`);
            await refetch();
            toast.info(`${item.name} foi removido`);
          } catch (error) {
            toast.info(error.message);
          }
        }
      },
    },
  ];

  return (
    <Page title="Departamentos">
      <Button
        className="mb-2"
        onClick={() => {
          setDepartments(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Criar Departamento
      </Button>
      <ListView actions={actions} columns={columns} endpoint={endpoint}>
        {({ refetch }) => (
          <Modal
            title={`${department.id ? "Edite um" : "Crie um"} Departamento`}
            show={visible}
            handleClose={() => setVisible(false)}
            handleSave={() => handleSave(refetch)}
          >
            <Form>
              <Form.Group>
                <Form.Label>Nome do Departamento</Form.Label>
                <Form.Control
                  name="department"
                  onChange={(event) =>
                    setDepartments({ ...department, name: event.target.value })
                  }
                  value={department.name}
                />
              </Form.Group>
            </Form>
          </Modal>
        )}
      </ListView>
    </Page>
  );
};

export default Departments;
