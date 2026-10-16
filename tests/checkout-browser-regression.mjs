// Run against an isolated payment page containing a synthetic order only.
// Compatible with the browser tool's Playwright API and ordinary Playwright pages.
// Never submits a payment, logs field values, or persists card data.
export async function verifyCheckoutCardFields(page) {
  const ensure = (condition, message) => { if (!condition) throw new Error(message) }
  const card = () => page.getByLabel('Número do Cartão (16 dígitos)', { exact: true })
  await page.getByRole('button', { name: /Cartão de Crédito/ }).click()
  const fields = [
    ['Número do Cartão (16 dígitos)', '0'.repeat(16)],
    ['Nome do Titular', 'SYNTHETIC BUYER'],
    ['Mês (MM)', '12'], ['Ano (YYYY)', '2030'],
  ]
  for (const [label, synthetic] of fields) {
    const input = page.getByLabel(label, { exact: true })
    await input.fill(''); await input.pressSequentially(synthetic)
    const state = await input.evaluate(el => {
      const style = getComputedStyle(el), r = el.getBoundingClientRect()
      return { length: el.value.length, color: style.color, background: style.backgroundColor, editable: !el.disabled && !el.readOnly, focused: document.activeElement === el, unobstructed: document.elementFromPoint(r.x+r.width/2,r.y+r.height/2) === el }
    })
    ensure(state.length === synthetic.length && state.editable && state.focused && state.unobstructed, 'Typing/focus failed: ' + label)
    const lum = rgb => { const c=rgb.match(/[0-9.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4); return c[0]*.2126+c[1]*.7152+c[2]*.0722 }
    const a=lum(state.color), b=lum(state.background)
    ensure((Math.max(a,b)+.05)/(Math.min(a,b)+.05) >= 4.5, 'Insufficient input contrast: ' + label)
    await input.press('Backspace')
    ensure(await input.evaluate(el => el.value.length) === synthetic.length - 1, 'Editing failed: ' + label)
    await input.fill('')
    ensure(await input.evaluate(el => el.value.length) === 0, 'Deletion failed: ' + label)
  }
  const cvv = page.getByLabel('CVV (Código de Segurança)', { exact: true })
  await page.locator('form button[type="button"]').click() // Show synthetic CVV for assertions; password values are redacted by some browser tools.
  await cvv.pressSequentially('0'.repeat(3))
  ensure(await cvv.evaluate(el => el.value.length) === 3, 'CVV typing failed')
  await cvv.press('Backspace'); ensure(await cvv.evaluate(el => el.value.length) === 2, 'CVV editing failed')
  await cvv.fill(''); await page.locator('form button[type="button"]').click()
  await page.getByRole('button', { name: 'Pix Instantâneo', exact: true }).click()
  ensure(await card().count() === 0, 'PIX did not hide card form')
  await page.getByRole('button', { name: /Cartão de Crédito/ }).click()
  await card().pressSequentially('0'.repeat(4)); ensure(await card().evaluate(el => el.value.length) === 4, 'Typing after PIX failed'); await card().fill('')
  await page.getByRole('link', { name: '← Voltar ao pedido', exact: true }).click()
  await page.getByRole('button', { name: 'Pagar novamente', exact: true }).click()
  await page.getByRole('button', { name: /Cartão de Crédito/ }).click()
  await card().pressSequentially('0'.repeat(4)); ensure(await card().evaluate(el => el.value.length) === 4, 'Typing after return failed'); await card().fill('')
  return { fields: 5, typingEditingDeletion: true, contrast: true, focusAndOverlay: true, pixAndReturn: true, paymentsSubmitted: 0 }
}
