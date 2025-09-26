import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner,
  Badge,
  Table,
  Tabs,
  Tab,
  Modal
} from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import RichTextEditor from '../components/RichTextEditor';

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

  // Estados para nuevas secciones
  const [reviews, setReviews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [libraryItems, setLibraryItems] = useState([]);
  
  // Estados para buscadores
  const [searchReviews, setSearchReviews] = useState('');
  const [searchPosts, setSearchPosts] = useState('');
  const [searchLibrary, setSearchLibrary] = useState('');
  
  // Estados para modales de edición
  const [showEditReview, setShowEditReview] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showEditLibrary, setShowEditLibrary] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Estados para formularios
  const [reviewForm, setReviewForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Books',
    rating: 5,
    tags: '',
    image: 'book',
    bannerImage: ''
  });
  
  const [postForm, setPostForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Personal',
    tags: '',
    image: 'heart',
    bannerImage: ''
  });
  
  const [libraryForm, setLibraryForm] = useState({
    title: '',
    author: '',
    type: 'Book',
    genre: '',
    rating: 5,
    status: 'Completed',
    year: '',
    description: '',
    tags: '',
    coverImage: '' // Nuevo campo para imagen de portada
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

  // Cargar datos automáticamente cuando se autentica
  useEffect(() => {
    if (isAuthenticated) {
      const savedPassword = localStorage.getItem('admin_password');
      if (savedPassword) {
        loadReviews();
        loadPosts();
        loadLibraryItems();
      }
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Probar acceso con la contraseña
      const response = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
        headers: { password }
      });

      setIsAuthenticated(true);
      localStorage.setItem('admin_password', password);
      setStats(response.data);
      
      // Cargar todos los datos en paralelo
      await Promise.all([
        loadFanfics(),
        loadReviews(),
        loadPosts(),
        loadLibraryItems()
      ]);
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
        axios.get(`${API_BASE_URL}/api/admin/stats`, { headers: { password: adminPassword } }),
        axios.get(`${API_BASE_URL}/api/admin/fanfics`, { headers: { password: adminPassword } })
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
      const response = await axios.get(`${API_BASE_URL}/api/admin/fanfics`, {
        headers: { password }
      });
      setFanfics(response.data);
    } catch (error) {
      setError('Error cargando fanfics');
    }
  };

  // Funciones para cargar nuevo contenido
  const loadReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/reviews`, {
        headers: { password }
      });
      setReviews(response.data);
    } catch (error) {
      console.error('Error cargando reseñas:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/posts`, {
        headers: { password }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error cargando posts:', error);
    }
  };

  const loadLibraryItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/library`, {
        headers: { password }
      });
      setLibraryItems(response.data);
    } catch (error) {
      console.error('Error cargando biblioteca:', error);
    }
  };

  // Funciones de filtrado
  const filteredReviews = reviews.filter(review => 
    review.title.toLowerCase().includes(searchReviews.toLowerCase()) ||
    review.category.toLowerCase().includes(searchReviews.toLowerCase()) ||
    (review.tags && review.tags.some(tag => tag.toLowerCase().includes(searchReviews.toLowerCase())))
  );

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchPosts.toLowerCase()) ||
    post.category.toLowerCase().includes(searchPosts.toLowerCase()) ||
    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchPosts.toLowerCase())))
  );

  const filteredLibraryItems = libraryItems.filter(item => 
    item.title.toLowerCase().includes(searchLibrary.toLowerCase()) ||
    item.author.toLowerCase().includes(searchLibrary.toLowerCase()) ||
    item.type.toLowerCase().includes(searchLibrary.toLowerCase()) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLibrary.toLowerCase())))
  );

  // Funciones para crear nuevo contenido
  const handleCreateReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const reviewData = {
        ...reviewForm,
        tags: reviewForm.tags.split(',').map(tag => tag.trim()),
        date: new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        readTime: `${Math.ceil(reviewForm.summary.length / 200)} min read`
      };

      await axios.post(`${API_BASE_URL}/api/admin/reviews`, reviewData, {
        headers: { password }
      });

      setSuccess('Reseña creada exitosamente');
      setReviewForm({
        title: '',
        summary: '',
        content: '',
        category: 'Books',
        rating: 5,
        tags: '',
        image: 'book',
        bannerImage: ''
      });
      loadReviews();
    } catch (error) {
      setError('Error creando reseña');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const postData = {
        ...postForm,
        tags: postForm.tags.split(',').map(tag => tag.trim()),
        date: new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        readTime: `${Math.ceil(postForm.summary.length / 200)} min read`
      };

      await axios.post(`${API_BASE_URL}/api/admin/posts`, postData, {
        headers: { password }
      });

      setSuccess('Post creado exitosamente');
      setPostForm({
        title: '',
        summary: '',
        content: '',
        category: 'Personal',
        tags: '',
        image: 'heart',
        bannerImage: ''
      });
      loadPosts();
    } catch (error) {
      setError('Error creando post');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLibraryItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const itemData = {
        ...libraryForm,
        tags: libraryForm.tags.split(',').map(tag => tag.trim())
      };

      await axios.post(`${API_BASE_URL}/api/admin/library`, itemData, {
        headers: { password }
      });

      setSuccess('Item de biblioteca creado exitosamente');
      setLibraryForm({
        title: '',
        author: '',
        type: 'Book',
        genre: '',
        rating: 5,
        status: 'Completed',
        year: '',
        description: '',
        tags: '',
        coverImage: '' // Reset del campo de imagen de portada
      });
      loadLibraryItems();
    } catch (error) {
      setError('Error creando item de biblioteca');
    } finally {
      setLoading(false);
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
      const response = await axios.post(`${API_BASE_URL}/api/admin/upload-csv`, formData, {
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

      await axios.post(`${API_BASE_URL}/api/admin/fanfics`, fanficData, {
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
      await axios.delete(`${API_BASE_URL}/api/admin/fanfics/${id}`, {
        headers: { password }
      });
      setSuccess('Fanfic eliminado exitosamente');
      loadFanfics();
      loadAdminData(password);
    } catch (error) {
      setError('Error eliminando fanfic');
    }
  };

  // Funciones de eliminación para nuevo contenido
  const deleteReview = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/reviews/${id}`, {
        headers: { password }
      });
      setSuccess('Reseña eliminada exitosamente');
      loadReviews();
    } catch (error) {
      setError('Error eliminando reseña');
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este post?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/posts/${id}`, {
        headers: { password }
      });
      setSuccess('Post eliminado exitosamente');
      loadPosts();
    } catch (error) {
      setError('Error eliminando post');
    }
  };

  const deleteLibraryItem = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este item de biblioteca?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/library/${id}`, {
        headers: { password }
      });
      setSuccess('Item de biblioteca eliminado exitosamente');
      loadLibraryItems();
    } catch (error) {
      setError('Error eliminando item de biblioteca');
    }
  };

  // Funciones para editar contenido
  const handleEditReview = (review) => {
    setEditingItem(review);
    // Pre-llenar el formulario con los datos existentes
    setReviewForm({
      title: review.title,
      summary: review.summary,
      content: review.content || '',
      category: review.category,
      rating: review.rating,
      bannerImage: review.bannerImage || '',
      tags: review.tags ? (Array.isArray(review.tags) ? review.tags.join(', ') : review.tags) : ''
    });
    setShowEditReview(true);
  };

  const handleEditPost = (post) => {
    setEditingItem(post);
    // Pre-llenar el formulario con los datos existentes
    setPostForm({
      title: post.title,
      summary: post.summary,
      content: post.content || '',
      category: post.category,
      readTime: post.readTime,
      bannerImage: post.bannerImage || '',
      tags: post.tags ? (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags) : ''
    });
    setShowEditPost(true);
  };

  const handleEditLibraryItem = (item) => {
    setEditingItem(item);
    // Pre-llenar el formulario con los datos existentes
    setLibraryForm({
      title: item.title,
      author: item.author,
      type: item.type,
      genre: item.genre,
      rating: item.rating,
      status: item.status,
      year: item.year || '',
      description: item.description || '',
      tags: item.tags ? (Array.isArray(item.tags) ? item.tags.join(', ') : item.tags) : '',
      coverImage: item.coverImage || ''
    });
    setShowEditLibrary(true);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/api/admin/reviews/${editingItem.id}`, reviewForm, {
        headers: { password }
      });
      setSuccess('Reseña actualizada exitosamente');
      setShowEditReview(false);
      setEditingItem(null);
      loadReviews();
    } catch (error) {
      setError('Error actualizando reseña');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/api/admin/posts/${editingItem.id}`, postForm, {
        headers: { password }
      });
      setSuccess('Post actualizado exitosamente');
      setShowEditPost(false);
      setEditingItem(null);
      loadPosts();
    } catch (error) {
      setError('Error actualizando post');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLibraryItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/api/admin/library/${editingItem.id}`, libraryForm, {
        headers: { password }
      });
      setSuccess('Item de biblioteca actualizado exitosamente');
      setShowEditLibrary(false);
      setEditingItem(null);
      loadLibraryItems();
    } catch (error) {
      setError('Error actualizando item de biblioteca');
    } finally {
      setLoading(false);
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
          <Tab eventKey="upload" title="Fanfics">
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

          {/* Nueva pestaña para Reseñas */}
          <Tab eventKey="reviews" title="Reseñas">
            <Row>
              <Col md={6}>
                <Card className="admin-card">
                  <Card.Header>
                    <h5>
                      <i className="bi bi-star me-2"></i>
                      Crear Nueva Reseña
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleCreateReview}>
                      <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                          type="text"
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>URL de Imagen Banner</Form.Label>
                        <Form.Control
                          type="url"
                          value={reviewForm.bannerImage}
                          onChange={(e) => setReviewForm({...reviewForm, bannerImage: e.target.value})}
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        <Form.Text className="text-muted">
                          Pega aquí la URL de la imagen que quieres usar como banner
                        </Form.Text>
                      </Form.Group>
                      
                        <Form.Group className="mb-3">
                          <Form.Label>Resumen (máximo 7 renglones)</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={7}
                            maxLength={500}
                            value={reviewForm.summary}
                            onChange={(e) => setReviewForm({...reviewForm, summary: e.target.value})}
                            required
                            placeholder="Escribe un resumen conciso de máximo 7 renglones..."
                          />
                          <Form.Text className="text-muted">
                            {reviewForm.summary.length}/500 caracteres
                          </Form.Text>
                        </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Contenido Completo</Form.Label>
                        <RichTextEditor
                          value={reviewForm.content}
                          onChange={(content) => setReviewForm({...reviewForm, content})}
                          placeholder="Escribe aquí el contenido completo de la reseña..."
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select
                              value={reviewForm.category}
                              onChange={(e) => setReviewForm({...reviewForm, category: e.target.value})}
                            >
                              <option value="Books">Books</option>
                              <option value="Fanfics">Fanfics</option>
                              <option value="Series">Series</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Select
                              value={reviewForm.rating}
                              onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                            >
                              <option value={1}>1 estrella</option>
                              <option value={2}>2 estrellas</option>
                              <option value={3}>3 estrellas</option>
                              <option value={4}>4 estrellas</option>
                              <option value={5}>5 estrellas</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Etiquetas (separadas por comas)</Form.Label>
                        <Form.Control
                          type="text"
                          value={reviewForm.tags}
                          onChange={(e) => setReviewForm({...reviewForm, tags: e.target.value})}
                          placeholder="Fantasy, Romance, Adventure"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Icono</Form.Label>
                        <Form.Select
                          value={reviewForm.image}
                          onChange={(e) => setReviewForm({...reviewForm, image: e.target.value})}
                        >
                          <option value="book">Libro</option>
                          <option value="heart">Corazón</option>
                          <option value="star">Estrella</option>
                          <option value="robot">Robot</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : 'Crear Reseña'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="admin-card">
                  <Card.Header>
                    <h5>
                      <i className="bi bi-list me-2"></i>
                      Reseñas Existentes ({filteredReviews.length})
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {/* Buscador */}
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Buscar reseñas..."
                        value={searchReviews}
                        onChange={(e) => setSearchReviews(e.target.value)}
                        className="mb-3"
                      />
                    </Form.Group>
                    
                    <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                      {filteredReviews.map((review) => (
                        <div key={review.id} className="mb-3 p-3 border rounded">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6>{review.title}</h6>
                              <p className="text-muted small">{review.summary}</p>
                              <div className="d-flex align-items-center gap-2">
                                <Badge bg="secondary">{review.category}</Badge>
                                <span>
                                  {Array.from({length: review.rating}).map((_, i) => (
                                    <i key={i} className="bi bi-star-fill text-warning"></i>
                                  ))}
                                </span>
                              </div>
                            </div>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditReview(review)}
                                title="Editar reseña"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => deleteReview(review.id)}
                                title="Eliminar reseña"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredReviews.length === 0 && (
                        <div className="text-center text-muted py-3">
                          {searchReviews ? 'No se encontraron reseñas' : 'No hay reseñas creadas'}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* Nueva pestaña para Posts de Blog */}
          <Tab eventKey="posts" title="Posts de Blog">
            <Row>
              <Col md={6}>
                <Card className="admin-card">
                  <Card.Header>
                    <h5>
                      <i className="bi bi-pencil me-2"></i>
                      Crear Nuevo Post
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleCreatePost}>
                      <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                          type="text"
                          value={postForm.title}
                          onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>URL de Imagen Banner</Form.Label>
                        <Form.Control
                          type="url"
                          value={postForm.bannerImage}
                          onChange={(e) => setPostForm({...postForm, bannerImage: e.target.value})}
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        <Form.Text className="text-muted">
                          Pega aquí la URL de la imagen que quieres usar como banner
                        </Form.Text>
                      </Form.Group>
                      
                        <Form.Group className="mb-3">
                          <Form.Label>Resumen (máximo 7 renglones)</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={7}
                            maxLength={500}
                            value={postForm.summary}
                            onChange={(e) => setPostForm({...postForm, summary: e.target.value})}
                            required
                            placeholder="Escribe un resumen conciso de máximo 7 renglones..."
                          />
                          <Form.Text className="text-muted">
                            {postForm.summary.length}/500 caracteres
                          </Form.Text>
                        </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Contenido Completo</Form.Label>
                        <RichTextEditor
                          value={postForm.content}
                          onChange={(content) => setPostForm({...postForm, content})}
                          placeholder="Escribe aquí el contenido completo del post..."
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select
                          value={postForm.category}
                          onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                        >
                          <option value="Personal">Personal</option>
                          <option value="Lifestyle">Lifestyle</option>
                          <option value="Technology">Technology</option>
                          <option value="Reflection">Reflection</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Etiquetas (separadas por comas)</Form.Label>
                        <Form.Control
                          type="text"
                          value={postForm.tags}
                          onChange={(e) => setPostForm({...postForm, tags: e.target.value})}
                          placeholder="Reading, Personal, Tips"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Icono</Form.Label>
                        <Form.Select
                          value={postForm.image}
                          onChange={(e) => setPostForm({...postForm, image: e.target.value})}
                        >
                          <option value="heart">Corazón</option>
                          <option value="book">Libro</option>
                          <option value="star">Estrella</option>
                          <option value="robot">Robot</option>
                          <option value="coffee">Café</option>
                          <option value="lightbulb">Bombilla</option>
                        </Form.Select>
                      </Form.Group>
                      
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : 'Crear Post'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="admin-card">
                  <Card.Header>
                    <h5>
                      <i className="bi bi-list me-2"></i>
                      Posts Existentes ({filteredPosts.length})
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {/* Buscador */}
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Buscar posts..."
                        value={searchPosts}
                        onChange={(e) => setSearchPosts(e.target.value)}
                        className="mb-3"
                      />
                    </Form.Group>
                    
                    <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                      {filteredPosts.map((post) => (
                        <div key={post.id} className="mb-3 p-3 border rounded">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6>{post.title}</h6>
                              <p className="text-muted small">{post.summary}</p>
                              <div className="d-flex align-items-center gap-2">
                                <Badge bg="info">{post.category}</Badge>
                                <span className="text-muted">{post.readTime}</span>
                              </div>
                            </div>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditPost(post)}
                                title="Editar post"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => deletePost(post.id)}
                                title="Eliminar post"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredPosts.length === 0 && (
                        <div className="text-center text-muted py-3">
                          {searchPosts ? 'No se encontraron posts' : 'No hay posts creados'}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* Nueva pestaña para Biblioteca */}
          <Tab eventKey="library" title="Biblioteca">
            <Row>
              <Col md={6}>
                <Card className="admin-card">
                  <Card.Header>
                    <h5>
                      <i className="bi bi-book me-2"></i>
                      Agregar a Biblioteca
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleCreateLibraryItem}>
                      <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                          type="text"
                          value={libraryForm.title}
                          onChange={(e) => setLibraryForm({...libraryForm, title: e.target.value})}
                          required
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Autor</Form.Label>
                        <Form.Control
                          type="text"
                          value={libraryForm.author}
                          onChange={(e) => setLibraryForm({...libraryForm, author: e.target.value})}
                          required
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Select
                              value={libraryForm.type}
                              onChange={(e) => setLibraryForm({...libraryForm, type: e.target.value})}
                            >
                              <option value="Book">Libro</option>
                              <option value="Fanfic">Fanfic</option>
                              <option value="Series">Serie</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Género</Form.Label>
                            <Form.Control
                              type="text"
                              value={libraryForm.genre}
                              onChange={(e) => setLibraryForm({...libraryForm, genre: e.target.value})}
                              placeholder="Fantasy, Romance, etc."
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Select
                              value={libraryForm.rating}
                              onChange={(e) => setLibraryForm({...libraryForm, rating: parseInt(e.target.value)})}
                            >
                              <option value={1}>1 estrella</option>
                              <option value={2}>2 estrellas</option>
                              <option value={3}>3 estrellas</option>
                              <option value={4}>4 estrellas</option>
                              <option value={5}>5 estrellas</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select
                              value={libraryForm.status}
                              onChange={(e) => setLibraryForm({...libraryForm, status: e.target.value})}
                            >
                              <option value="Completed">Completado</option>
                              <option value="Reading">Leyendo</option>
                              <option value="Want to Read">Quiero leer</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Año</Form.Label>
                            <Form.Control
                              type="text"
                              value={libraryForm.year}
                              onChange={(e) => setLibraryForm({...libraryForm, year: e.target.value})}
                              placeholder="2023"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={libraryForm.description}
                          onChange={(e) => setLibraryForm({...libraryForm, description: e.target.value})}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Etiquetas (separadas por comas)</Form.Label>
                        <Form.Control
                          type="text"
                          value={libraryForm.tags}
                          onChange={(e) => setLibraryForm({...libraryForm, tags: e.target.value})}
                          placeholder="Magic, School, Friendship"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>URL de Imagen de Portada</Form.Label>
                        <Form.Control
                          type="url"
                          value={libraryForm.coverImage}
                          onChange={(e) => setLibraryForm({...libraryForm, coverImage: e.target.value})}
                          placeholder="https://ejemplo.com/portada-libro.jpg"
                        />
                        <Form.Text className="text-muted">
                          Pega aquí la URL de la imagen de portada del libro/libro/serie
                        </Form.Text>
                      </Form.Group>
                      
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : 'Agregar a Biblioteca'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="admin-card">
                  <Card.Header>
                    <h5>
                      <i className="bi bi-list me-2"></i>
                      Biblioteca ({filteredLibraryItems.length})
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {/* Buscador */}
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Buscar en biblioteca..."
                        value={searchLibrary}
                        onChange={(e) => setSearchLibrary(e.target.value)}
                        className="mb-3"
                      />
                    </Form.Group>
                    
                    <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                      {filteredLibraryItems.map((item) => (
                        <div key={item.id} className="mb-3 p-3 border rounded">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6>{item.title}</h6>
                              <p className="text-muted small">por {item.author}</p>
                              <div className="d-flex gap-2 align-items-center">
                                <Badge bg="primary">{item.type}</Badge>
                                <Badge bg="secondary">{item.genre}</Badge>
                                <Badge bg={item.status === 'Completed' ? 'success' : 'warning'}>
                                  {item.status}
                                </Badge>
                                <span>
                                  {Array.from({length: item.rating}).map((_, i) => (
                                    <i key={i} className="bi bi-star-fill text-warning"></i>
                                  ))}
                                </span>
                              </div>
                            </div>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditLibraryItem(item)}
                                title="Editar item"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => deleteLibraryItem(item.id)}
                                title="Eliminar item"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredLibraryItems.length === 0 && (
                        <div className="text-center text-muted py-3">
                          {searchLibrary ? 'No se encontraron items' : 'No hay items en biblioteca'}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Container>

      {/* Modal de edición de Reseña */}
      <Modal show={showEditReview} onHide={() => setShowEditReview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Reseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateReview}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Resumen (máximo 7 renglones)</Form.Label>
              <Form.Control
                as="textarea"
                rows={7}
                maxLength={500}
                value={reviewForm.summary}
                onChange={(e) => setReviewForm({...reviewForm, summary: e.target.value})}
                required
                placeholder="Escribe un resumen conciso de máximo 7 renglones..."
              />
              <Form.Text className="text-muted">
                {reviewForm.summary.length}/500 caracteres
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <RichTextEditor
                value={reviewForm.content}
                onChange={(content) => setReviewForm({...reviewForm, content})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={reviewForm.category}
                    onChange={(e) => setReviewForm({...reviewForm, category: e.target.value})}
                  >
                    <option value="Book">Libro</option>
                    <option value="Movie">Película</option>
                    <option value="Series">Serie</option>
                    <option value="Fanfic">Fanfic</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Calificación</Form.Label>
                  <Form.Select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5].map(rating => (
                      <option key={rating} value={rating}>{rating} estrella{rating > 1 ? 's' : ''}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen Banner</Form.Label>
              <Form.Control
                type="url"
                value={reviewForm.bannerImage}
                onChange={(e) => setReviewForm({...reviewForm, bannerImage: e.target.value})}
                placeholder="https://ejemplo.com/imagen-banner.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etiquetas (separadas por comas)</Form.Label>
              <Form.Control
                type="text"
                value={reviewForm.tags}
                onChange={(e) => setReviewForm({...reviewForm, tags: e.target.value})}
                placeholder="fantasía, aventura, romance"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button variant="secondary" onClick={() => setShowEditReview(false)}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de edición de Post */}
      <Modal show={showEditPost} onHide={() => setShowEditPost(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Post de Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdatePost}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={postForm.title}
                onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Resumen (máximo 7 renglones)</Form.Label>
              <Form.Control
                as="textarea"
                rows={7}
                maxLength={500}
                value={postForm.summary}
                onChange={(e) => setPostForm({...postForm, summary: e.target.value})}
                required
                placeholder="Escribe un resumen conciso de máximo 7 renglones..."
              />
              <Form.Text className="text-muted">
                {postForm.summary.length}/500 caracteres
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <RichTextEditor
                value={postForm.content}
                onChange={(content) => setPostForm({...postForm, content})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={postForm.category}
                    onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                  >
                    <option value="Personal">Personal</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Libros">Libros</option>
                    <option value="Fanfics">Fanfics</option>
                    <option value="Otros">Otros</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tiempo de lectura</Form.Label>
                  <Form.Control
                    type="text"
                    value={postForm.readTime}
                    onChange={(e) => setPostForm({...postForm, readTime: e.target.value})}
                    placeholder="5 min"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen Banner</Form.Label>
              <Form.Control
                type="url"
                value={postForm.bannerImage}
                onChange={(e) => setPostForm({...postForm, bannerImage: e.target.value})}
                placeholder="https://ejemplo.com/imagen-banner.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etiquetas (separadas por comas)</Form.Label>
              <Form.Control
                type="text"
                value={postForm.tags}
                onChange={(e) => setPostForm({...postForm, tags: e.target.value})}
                placeholder="personal, reflexiones, vida"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button variant="secondary" onClick={() => setShowEditPost(false)}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de edición de Biblioteca */}
      <Modal show={showEditLibrary} onHide={() => setShowEditLibrary(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Item de Biblioteca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateLibraryItem}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={libraryForm.title}
                onChange={(e) => setLibraryForm({...libraryForm, title: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                value={libraryForm.author}
                onChange={(e) => setLibraryForm({...libraryForm, author: e.target.value})}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    value={libraryForm.type}
                    onChange={(e) => setLibraryForm({...libraryForm, type: e.target.value})}
                  >
                    <option value="Book">Libro</option>
                    <option value="Fanfic">Fanfic</option>
                    <option value="Series">Serie</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Género</Form.Label>
                  <Form.Control
                    type="text"
                    value={libraryForm.genre}
                    onChange={(e) => setLibraryForm({...libraryForm, genre: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Calificación</Form.Label>
                  <Form.Select
                    value={libraryForm.rating}
                    onChange={(e) => setLibraryForm({...libraryForm, rating: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5].map(rating => (
                      <option key={rating} value={rating}>{rating} estrella{rating > 1 ? 's' : ''}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={libraryForm.status}
                    onChange={(e) => setLibraryForm({...libraryForm, status: e.target.value})}
                  >
                    <option value="Completed">Completado</option>
                    <option value="Reading">Leyendo</option>
                    <option value="Want to Read">Quiero leer</option>
                    <option value="Dropped">Abandonado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Año</Form.Label>
                  <Form.Control
                    type="text"
                    value={libraryForm.year}
                    onChange={(e) => setLibraryForm({...libraryForm, year: e.target.value})}
                    placeholder="2023"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={libraryForm.description}
                onChange={(e) => setLibraryForm({...libraryForm, description: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen de Portada</Form.Label>
              <Form.Control
                type="url"
                value={libraryForm.coverImage}
                onChange={(e) => setLibraryForm({...libraryForm, coverImage: e.target.value})}
                placeholder="https://ejemplo.com/portada-libro.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Etiquetas (separadas por comas)</Form.Label>
              <Form.Control
                type="text"
                value={libraryForm.tags}
                onChange={(e) => setLibraryForm({...libraryForm, tags: e.target.value})}
                placeholder="fantasía, aventura, romance"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button variant="secondary" onClick={() => setShowEditLibrary(false)}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Admin;
