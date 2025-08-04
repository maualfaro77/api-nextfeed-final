const Profile = require('../models/Profile');

// Buscar todos los perfiles
exports.buscarTodo = async (req, res) => {
  try {
    const profiles = await Profile.find({});
    if (profiles.length) {
      return res.status(200).json({ profiles });
    }
    return res.status(204).json({ mensaje: 'No hay perfiles registrados' });
  } catch (e) {
    return res.status(404).json({ mensaje: `Error al consultar la información: ${e}` });
  }
};

// Agregar un perfil
exports.agregarPerfil = async (req, res) => {
  try {
    const newProfile = new Profile(req.body);
    const info = await newProfile.save();
    return res.status(200).json({
      mensaje: 'La información se guardó correctamente',
      info
    });
  } catch (e) {
    return res.status(404).json({ mensaje: `Error al guardar la información: ${e}` });
  }
};

// Buscar perfil por campo dinámico
exports.buscarPerfil = async (req, res, next) => {
  if (!req.body) req.body = {};
  let consulta = {};
  consulta[req.params.key] = req.params.value;
  try {
    const profiles = await Profile.find(consulta);
    if (!profiles.length) return next();
    req.body.profiles = profiles;
    return next();
  } catch (e) {
    req.body.e = e;
    return next();
  }
};

// Mostrar perfil encontrado
exports.mostrarPerfil = (req, res) => {
  if (req.body.e) return res.status(404).json({ mensaje: 'Error al consultar la información' });
  if (!req.body.profiles) return res.status(204).json({ mensaje: 'No hay nada que mostrar' });
  return res.status(200).json({ profiles: req.body.profiles });
};

// Eliminar perfil por campo dinámico
exports.eliminarPerfil = async (req, res) => {
  const profiles = req.body.profiles;
  try {
    await Profile.deleteOne(profiles[0]);
    return res.status(200).json({ mensaje: 'Registro eliminado' });
  } catch (e) {
    return res.status(404).json({ mensaje: 'Error al eliminar la información', e });
  }
};

// Modificar perfil por campo dinámico
exports.modificarPerfil = async (req, res) => {
  const profiles = req.body.profiles;
  if (!profiles || !profiles.length) {
    return res.status(404).json({ mensaje: 'No se encontró el perfil' });
  }
  try {
    await Profile.updateOne(profiles[0], req.body);
    return res.status(200).json({ mensaje: 'Se registró correctamente :)' });
  } catch (e) {
    return res.status(404).json({ mensaje: 'Error al modificar la información', e });
  }
};