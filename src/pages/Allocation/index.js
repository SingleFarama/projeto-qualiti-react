import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";

const endpoint = "/allocations";

const columns = [
  {
    value: "ID",
    id: "id",
  },
  {
      value: "Professor",
      id: "professor",
      render: (professor) => professor.name,
  },
  {
      value: "ProfessorId",
      id: "professor",
      render: (professor) => professor.id,
  },
  {
    value: "Course",
    id: "course",
    render: (course) => course.name,
  },
  {
    value: "CourseId",
    id: "course",
    render: (course) => course.id,
  },
  {
    value: "DayofWeek",
    id: "dayOfWeek",
  },
  {
    value: "StartHour",
    id: "startHour",
  },
  {
    value: "EndHour",
    id: "endHour",
  },
];

const INITIAL_STATE = { id: 0, professor: "", professorId: 0, course: "", courseId: 0};

const Allocations = () => {
  const [visible, setVisible] = useState(false);
  const [course, setCourses] = useState([]);
  const [professor, setProfessors] = useState([]);
  const [allocation, setAllocations] = useState(INITIAL_STATE);

  const handleSave = async (refetch) => {
    try {
      if (allocation.id) {
        await api.put(`${endpoint}/${allocation.id}`, {
          name: allocation.name,
          professor: allocation.professor,
          course: allocation.course,
          DayOfWeek: allocation.DayOfWeek,
          startHour: allocation.startHour,
          endHour: allocation.endHour,
        });

        toast.success("Atualizado com sucesso!");
      } else {
        await api.post(endpoint, { name: allocation.name,
            professor: allocation.professor,
            course: allocation.course,
            DayOfWeek: allocation.DayOfWeek,
            startHour: allocation.startHour,
            endHour: allocation.endHour, });

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
      name: "Edit",
      action: (_allocation) => {
        setAllocations(_allocation);
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
            toast.info(`${item.name} foi removido`);
          } catch (error) {
            toast.info(error.message);
          }
        }
      },
    },
  ];

  return (
    <Page title="Alocações">
      <Button
        className="mb-2"
        onClick={() => {
          setAllocations(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Criar Alocações
      </Button>
      <ListView actions={actions} columns={columns} endpoint={endpoint}>
        {({ refetch }) => (
          <Modal
            title={`${course.id ? "Update" : "Create"} Course`}
            show={visible}
            handleClose={() => setVisible(false)}
            handleSave={() => handleSave(refetch)}
          >
            <Form>
              <Form.Group>
                <Form.Label>Allcations Name</Form.Label>
                <Form.Control
                  name="allocation"
                  onChange={(event) =>
                    setAllocations({ ...allocation, name: event.target.value })
                  }
                  value={allocation.name}
                />
              </Form.Group>
            </Form>
          </Modal>
        )}
      </ListView>
    </Page>
  );
};

export default Allocations;
