import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Modal,
  Spinner,
  Badge,
  Table,
  Tabs,
  Tab
} from 'react-bootstrap';
import axios from 'axios';

function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para diferentes secciones
  const [stats, setStats] = useState(null);
  const [fanfics, setFanfics] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [duplicateOptions, setDuplicateOptions] = useState({
    skipDuplicates: true,
    updateDuplicates: false
  });
  
  // Estado para formulario manual
  const [manualForm, setManualForm] = useState({
    titulo: '',
    autor: '',
    resumen: '',
    etiquetas: '',
    advertencias: '',
    enlace: ''
  });

  // Verificar autenticación y cargar datos
  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password');
    if (savedPassword) {
      setPassword(savedPassword);
      setIsAuthenticated(true);
      loadAdminData(savedPassword);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Probar acceso con la contraseña
      const response = await axios.get('/api/admin/stats', {
        headers: { password }
      });

      setIsAuthenticated(true);
      localStorage.setItem('admin_password', password);
      setStats(response.data);
      loadFanfics();
    } catch (error) {
      setError('Contraseña incorrecta');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('admin_password');
    setStats(null);
    setFanfics([]);
  };

  const loadAdminData = async (adminPassword) => {
    try {
      const [statsRes, fanficsRes] = await Promise.all([
        axios.get('/api/admin/stats', { headers: { password: adminPassword } }),
        axios.get('/api/admin/fanfics', { headers: { password: adminPassword } })
      ]);
      
      setStats(statsRes.data);
      setFanfics(fanficsRes.data);
    } catch (error) {
      console.error('Error cargando datos admin:', error);
      setError('Error cargando datos');
    }
  };

  const loadFanfics = async () => {
    try {
      const response = await axios.get('/api/admin/fanfics', {
        headers: { password }
      });
      setFanfics(response.data);
    } catch (error) {
      setError('Error cargando fanfics');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadProgress(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('csvFile', selectedFile);
    formData.append('skipDuplicates', duplicateOptions.skipDuplicates);
    formData.append('updateDuplicates', duplicateOptions.updateDuplicates);

    try {
      const response = await axios.post('/api/admin/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          password
        }
      });

      const { summary } = response.data;
      let successMessage = `📊 Procesamiento completado:\n`;
      successMessage += `✅ Nuevos: ${summary.nuevos}\n`;
      if (summary.duplicados > 0) successMessage += `🔄 Duplicados omitidos: ${summary.duplicados}\n`;
      if (summary.actualizados > 0) successMessage += `📝 Actualizados: ${summary.actualizados}\n`;
      if (summary.fallidos > 0) successMessage += `❌ Fallidos: ${summary.fallidos}`;

      setSuccess(successMessage);
      setSelectedFile(null);
      loadFanfics();
      loadAdminData(password); // Actualizar stats
    } catch (error) {
      setError(error.response?.data?.error || 'Error subiendo archivo');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const fanficData = {
        ...manualForm,
        etiquetas: manualForm.etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await axios.post('/api/admin/fanfics', fanficData, {
        headers: { password }
      });

      setSuccess('Fanfic creado exitosamente');
      setManualForm({
        titulo: '',
        autor: '',
        resumen: '',
        etiquetas: '',
        advertencias: '',
        enlace: ''
      });
      loadFanfics();
      loadAdminData(password);
    } catch (error) {
      setError(error.response?.data?.error || 'Error creando fanfic');
    } finally {
      setLoading(false);
    }
  };

  const deleteFanfic = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este fanfic?')) return;

    try {
      await axios.delete(`/api/admin/fanfics/${id}`, {
        headers: { password }
      });
      setSuccess('Fanfic eliminado exitosamente');
      loadFanfics();
      loadAdminData(password);
    } catch (error) {
      setError('Error eliminando fanfic');
    }
  };

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="admin-card">
              <Card.Header className="text-center">
                <h4>
                  <i className="bi bi-shield-lock me-2"></i>
                  Acceso de Administrador
                </h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña de administrador</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Ingresa la contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  {error && (
                    <Alert variant="danger">{error}</Alert>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-100 btn-gradient"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-key me-2"></i>
                        Ingresar
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className="admin-container">
      <Container>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h2>
                <i className="bi bi-gear me-2"></i>
                Panel de Administración
              </h2>
              <Button variant="outline-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </Button>
            </div>
          </Col>
        </Row>

        {/* Alertas */}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Estadísticas */}
        {stats && (
          <Row className="mb-4">
            <Col md={3}>
              <Card className="stat-card">
                <div className="stat-number">{stats.totalFanfics}</div>
                <div>Total Fanfics</div>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <div className="stat-number">{stats.totalFandoms}</div>
                <div>Fandoms</div>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <div className="stat-number">{stats.totalAutores}</div>
                <div>Autores</div>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <div className="stat-number">
                  {Math.floor(stats.serverInfo?.uptime / 3600) || 0}h
                </div>
                <div>Uptime</div>
              </Card>
            </Col>
          </Row>
        )}

        {/* Tabs de administración */}
        <Tabs defaultActiveKey="upload" className="mb-4">
          <Tab eventKey="upload" title="Subir Fanfics">
            <Row>
              <Col md={6}>
                <Card className="admin-card">
                  <Card.Header>
                    <h5>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Subir desde CSV
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleFileUpload}>
                      <Form.Group className="mb-3">
                        <Form.Label>Archivo CSV</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".csv"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          required
                        />
                        <Form.Text className="text-muted">
                          Formato: Titulo, Autor, Resumen, Etiquetas, Advertencias, Enlace
                        </Form.Text>
                      </Form.Group>

                      {/* Opciones de duplicados */}
                      <Card className="mb-3" style={{backgroundColor: '#f8f9fa'}}>
                        <Card.Body>
                          <h6 className="mb-3">
                            <i className="bi bi-shield-check me-2"></i>
                            Manejo de Duplicados
                          </h6>
                          
                          <Form.Check
                            type="radio"
                            id="skip-duplicates"
                            name="duplicateAction"
                            label="🔄 Omitir duplicados (recomendado)"
                            checked={duplicateOptions.skipDuplicates && !duplicateOptions.updateDuplicates}
                            onChange={() => setDuplicateOptions({skipDuplicates: true, updateDuplicates: false})}
                            className="mb-2"
                          />
                          
                          <Form.Check
                            type="radio"
                            id="update-duplicates"
                            name="duplicateAction"
                            label="📝 Actualizar duplicados existentes"
                            checked={duplicateOptions.updateDuplicates}
                            onChange={() => setDuplicateOptions({skipDuplicates: false, updateDuplicates: true})}
                            className="mb-2"
                          />
                          
                          <Form.Check
                            type="radio"
                            id="reject-duplicates"
                            name="duplicateAction"
                            label="❌ Rechazar duplicados (generar error)"
                            checked={!duplicateOptions.skipDuplicates && !duplicateOptions.updateDuplicates}
                            onChange={() => setDuplicateOptions({skipDuplicates: false, updateDuplicates: false})}
                          />
                          
                          <Form.Text className="text-muted d-block mt-2">
                            <small>
                              Los duplicados se detectan por URL de AO3. 
                              {duplicateOptions.skipDuplicates && !duplicateOptions.updateDuplicates && " Los duplicados serán omitidos silenciosamente."}
                              {duplicateOptions.updateDuplicates && " Los fanfics existentes serán actualizados con nueva información."}
                              {!duplicateOptions.skipDuplicates && !duplicateOptions.updateDuplicates && " La carga fallará si hay duplicados."}
                            </small>
                          </Form.Text>
                        </Card.Body>
                      </Card>
                      
                      <Button 
                        type="submit" 
                        className="btn-gradient"
                        disabled={!selectedFile || uploadProgress}
                      >
                        {uploadProgress ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-upload me-2"></i>
                            Subir CSV
                          </>
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="admin-card">
                  <Card.Header>
                    <h5>
                      <i className="bi bi-plus-circle me-2"></i>
                      Agregar Manualmente
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleManualSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                          type="text"
                          value={manualForm.titulo}
                          onChange={(e) => setManualForm({...manualForm, titulo: e.target.value})}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Autor</Form.Label>
                        <Form.Control
                          type="text"
                          value={manualForm.autor}
                          onChange={(e) => setManualForm({...manualForm, autor: e.target.value})}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Etiquetas</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Separadas por comas"
                          value={manualForm.etiquetas}
                          onChange={(e) => setManualForm({...manualForm, etiquetas: e.target.value})}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Enlace</Form.Label>
                        <Form.Control
                          type="url"
                          value={manualForm.enlace}
                          onChange={(e) => setManualForm({...manualForm, enlace: e.target.value})}
                          required
                        />
                      </Form.Group>
                      
                      <Button 
                        type="submit" 
                        className="btn-gradient"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-save me-2"></i>
                            Guardar Fanfic
                          </>
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="manage" title="Gestionar Fanfics">
            <Card className="admin-card">
              <Card.Header>
                <h5>
                  <i className="bi bi-list me-2"></i>
                  Lista de Fanfics ({fanfics.length})
                </h5>
              </Card.Header>
              <Card.Body>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Fandom</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fanfics.map(fanfic => (
                        <tr key={fanfic.id}>
                          <td>
                            <strong>{fanfic.titulo}</strong>
                          </td>
                          <td>{fanfic.autor}</td>
                          <td>
                            {fanfic.etiquetas?.find(tag => 
                              tag.includes('Harry Potter') || 
                              tag.includes('Marvel') || 
                              tag.includes('Twilight')
                            ) || 'N/A'}
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteFanfic(fanfic.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default Admin;
