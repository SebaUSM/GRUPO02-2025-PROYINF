import unittest
import requests
import json
import glob
import os

BASE_URL = 'http://localhost:3000'

class TestBackupEndpoints(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.backup_dir = './backups'

    def test_post_backup_trigger(self):
        try:
            response = requests.post(f'{BASE_URL}/backup/trigger', timeout=5)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertIn('mensaje', data)
            self.assertIn(data.get('correo'), ['enviado', 'falló'])
        except requests.exceptions.ConnectionError:
            self.fail("No se pudo conectar al servidor.")

    def test_backup_file_created_and_valid(self):
        backup_files = sorted(
            glob.glob(f'{self.backup_dir}/backup-completo-*.json'),
            key=os.path.getmtime,
            reverse=True
        )
        self.assertGreater(len(backup_files), 0)
        with open(backup_files[0], 'r', encoding='utf-8') as f:
            contenido = json.load(f)
        self.assertIn('users', contenido)
        self.assertIn('pdf_files', contenido)

    def test_get_last_backup(self):
        try:
            response = requests.get(f'{BASE_URL}/backup/last', timeout=5)
            self.assertEqual(response.status_code, 200)
            self.assertIn('users', response.json())
            self.assertIn('pdf_files', response.json())
        except requests.exceptions.ConnectionError:
            self.fail("No se pudo conectar al servidor.")

    def test_get_last_backup_sin_archivos(self):
        if os.path.exists('./backups'):
            os.rename('./backups', './backups_temp')
        try:
            response = requests.get(f'{BASE_URL}/backup/last', timeout=5)
            self.assertEqual(response.status_code, 404)
            self.assertIn('error', response.json())
        finally:
            if os.path.exists('./backups_temp'):
                os.rename('./backups_temp', './backups')

if __name__ == '__main__':
    unittest.main()