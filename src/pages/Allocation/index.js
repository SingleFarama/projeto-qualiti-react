import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import ListView from "../../components/ListView/index";
import Modal from "../../components/Modal/index";
import Page from "../../components/Page/index";
import api from "../../services/axios";

import diaDaSemana from './AllocationTime.js';

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
    value: "Curso",
    id: "course",
    render: (course) => course.name,
  },
  {
    value: "Dia da Semana",
    id: "dayOfWeek",
  },
  {
    value: "Inicil",
    id: "startHour",
  },
  {
    value: "Fim",
    id: "endHour",
  },
];


const INITIAL_STATE = { id: 0, professorId: 0, courseId: 0, dayOfWeek: "", startHour: "", endHour: ""};

const Allocations = () => {
  const [visible, setVisible] = useState(false);
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [allocation, setAllocation] = useState(INITIAL_STATE);

  useEffect(() => {
    api
      .get("/professors")
      .then((response) => {
        setProfessors(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
    api
      .get("/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const handleSave = async (refetch) => {
    const data = {
      professorId: allocation.professorId,
      courseId: allocation.courseId,
      dayOfWeek: allocation.dayOfWeek,
      startHour: allocation.startHour + "+0000",
      endHour: allocation.endHour + "+0000",
    };
    try {
      if (allocation.id) {
        await api.put(`${endpoint}/${allocation.id}`, data);

        toast.success("Atualizado com sucesso!");
      } else {
        await api.post(endpoint, data);

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
      action: ({ id, professor: { id: professorId }, course: { id: courseId }, dayOfWeek, startHour, endHour, }) => {
        setAllocation({ id, professorId, courseId, dayOfWeek, startHour, endHour });
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
  const onChange = ({ target: { name, value } }) => {
    setAllocation({
      ...allocation,
      [name]: value,
    });
  };

  return (
    <Page title="Alocações">
      <Button
        className="mb-2"
        onClick={() => {
          setAllocation(INITIAL_STATE);
          setVisible(true);
        }}
      >
        Criar Alocação
      </Button>
      <ListView actions={actions} columns={columns} endpoint={endpoint}>
        {({ refetch }) => (
          <Modal
            title={`${allocation.id ? "Edite uma" : "Crie uma"} Alocação`}
            show={visible}
            handleClose={() => setVisible(false)}
            handleSave={() => handleSave(refetch)}
          >
            <Form>
              <Form.Group className="mt-4">
                <Form.Label>Professor</Form.Label>
                <select
                  className="form-control"
                  name="professorId"
                  onChange={onChange}
                  value={allocation.professorId}
                >
                  <option>Escolha um Professor</option>
                  {professors.map((professor, index) => (
                    <option key={`professor-${index}`} value={professor.id}>
                      {professor.name}
                    </option>
                  ))}
                </select>
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label>Curso</Form.Label>
                <select
                  className="form-control"
                  name="courseId"
                  onChange={onChange}
                  value={allocation.courseId}
                >
                  <option>Escolha um Curso</option>
                  {courses.map((course, index) => (
                    <option key={`course-${index}`} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label>Dia da Semana</Form.Label>
                <select
                  className="form-control"
                  name="dayOfWeek"
                  onChange={onChange}
                  value={allocation.dayOfWeek}
                >
                  <option>Escolha um dia</option>
                  {diaDaSemana.map((diaDaSemana, index) => (
                    <option key={`-dia-${index}`} value={diaDaSemana.id}>
                      {diaDaSemana.name}
                    </option>
                  ))}
                </select>
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label>Inicil</Form.Label>
                <Form.Control
                  name="startHour"
                  onChange={onChange}
                  value={(allocation.startHour ? allocation.startHour.replace('+0000', '') : allocation.startHour)}
                  placeholder="Ex.: 20:00"
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label>Fim</Form.Label>
                <Form.Control
                  name="endHour"
                  onChange={onChange}
                  value={(allocation.endHour ? allocation.endHour.replace('+0000', '') : allocation.endHour) }
                  placeholder="Ex.: 21:00"
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
