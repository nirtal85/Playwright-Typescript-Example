import { test } from '../fixtures/projectFixtures';
import path from 'path';

test('file upload using filechooser', async ({ page }) => {
  await page.goto('https://www.w3schools.com/howto/howto_html_file_upload_button.asp');

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('#myFile').click() // Adjust selector if needed
  ]);
  await fileChooser.setFiles(path.resolve('resources/dog.png'));
  await page.waitForTimeout(5000);
});
