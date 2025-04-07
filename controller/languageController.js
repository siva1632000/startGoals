import Language from '../model/language.js';
import { languageSchema } from '../utils/languageValidate.js';

export const getLanguages = async (req, res) => {
  try {
    const languages = await Language.findAll();
    if (!languages.length) {
      return res.status(404).json({ success: false, message: 'Languages not found' });
    }
    res.json({ success: true, data: languages, message: 'Success' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const postLanguage = async (req, res) => {
  const { error } = languageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const { language_code, language_name } = req.body;

    const exists = await Language.findOne({ where: { language_code } });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Language already exists' });
    }

    const newLang = await Language.create({ language_code, language_name });

    res.status(201).json({
      success: true,
      data: newLang,
      message: 'Language created successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
