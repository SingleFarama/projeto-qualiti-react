import { useEffect, useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { toast } from "react-toastify";

import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";

const endpoint = "/professors";

const columns = [
  {
    value: "ID",
    id: "id",
  },
  {
    value: "Name",
    id: "name",
  },
  {
      value: "CPF",
      id: "cpf",
  },
  {
    value: "Department",
    id: "department",
    render: (department) => department.name,
  },
];

const INITIAL_STATE = {id = 0, name = "", department = "", department_id: 0};

const Professors = () => {
    const [visible, setVisible] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [professor, setProfessor] = useState(INITIAL_STATE);

    useEffect(() => {
        api
          .get("/departments")
          .then((response) => {
            setDepartments(response.data);
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }, []);

    const handleSave = async (refetch) => {
        try {
            if (professor.id) {
                await api.put(`${endpoint}/${professor.id}`,{
                    name: professor.name,
                    cpf: professor.cpf,
                    department: professor.department,
                }),

                toast.success("atualizado com Sucesso!");
            } else {
                await api.post(endpoint, { name: professor.name, cpf: professor.cpf, department: professor.department});

                toast.success("Cadastrado com Sucesso!");
            }

            setVisible(false);

            await refetch();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const actions = [
        {
            name: "Edit",
            action: (_professor) => {
                setProfessor(_professor);
                setVisible(true);
            },
        },
        {
            name: "Remove",
            action: async (item, refetch) => {
                if (window.confirm("Você tem certeza que deseja remover?")) {
                    try {
                        await api.delete(`${endpoint}/${item.id}`);
                        await refetch();
                        toast.info(`${item.name} foi Removido`);
                    } catch (error) {
                        toast.info(error.message);
                    }
                }
            },
        },
    ];

    return (
        <Page title="Professores">
            <Button className="mb-2"
            onClick={() => {
                setProfessor(INITIAL_STATE);
                setVisible(true);
            }}
            >
                Criar Curso
            </Button>
            <ListView actions={actions} columns={columns} endpoint={endpoint}>
                {({ refetch }) => (
                    <Modal
                    title={`${professor.id ? "Update" : "Create"} Course`}
                    show={visible}
                    handleClose={() => setVisible(false)}
                    handleClose={() => handleSave(refetch)}
                    >
                        <Form>
                            <Form.Group>
                                <Form.Label>Professor Name</Form.Label>
                                <Form.Control
                                name = "professor"
                                onChange={(event) =>
                                  setProfessor({ ...professor, name: event.target.value })
                                }
                                value={professor.name}
                                />
                            </Form.Group>
                        </Form>
                    </Modal>
                )}
            </ListView>
        </Page>
    )
}

export default Professors;