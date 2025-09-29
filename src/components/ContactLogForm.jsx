import { useState, useEffect } from "react";
import { createContactLog } from "../services/contactLogService";
import { getTemplates } from "../services/templateService";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

/**
 * Componente para registrar un nuevo contacto con una plantilla
 */
const ContactLogForm = ({ contact, onClose, onSuccess }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contactId: contact?.id || "",
    templateUsed: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Cargar plantillas disponibles
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Error al cargar plantillas:", error);
        toast.error("No se pudieron cargar las plantillas");
      }
    };

    fetchTemplates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si se está cambiando el tipo de plantilla, actualizar las notas con el contenido
    if (name === 'templateUsed') {
      const template = templates.find(t => t.type === value);
      if (template) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          notes: template.content
        }));
        return;
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createContactLog(formData);
      toast.success("Contacto registrado exitosamente");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error al registrar contacto:", error);
      toast.error("Error al registrar el contacto");
    } finally {
      setLoading(false);
    }
  };

  // Obtener la plantilla seleccionada
  const selectedTemplate = templates.find(
    (t) => t.type === formData.templateUsed
  );

  // Agrupar plantillas por tipo
  const templateTypes = [
    ...new Set(templates.map((template) => template.type)),
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Contactar a {contact?.name}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Fecha</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tipo de Plantilla</label>
          <select
            name="templateUsed"
            value={formData.templateUsed}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecciona un tipo de plantilla</option>
            {templateTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* {selectedTemplate && (
          <div className="mb-4 p-3 bg-gray-50 rounded border">
            <h3 className="font-medium mb-2">
              Plantilla: {selectedTemplate.name}
            </h3>
            <div className="whitespace-pre-wrap mb-2">{selectedTemplate.content}</div>
          </div>
        )} */}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Notas</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Escribe notas sobre este contacto..."
          ></textarea>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Registrar contacto"}
          </button>
        </div>
      </form>
    </div>
  );
};

ContactLogForm.propTypes = {
  contact: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default ContactLogForm;
