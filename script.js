const cardsPerRow = 4
const cardCount = 12

const dragging = {
  card: null,
  offsetX: 0,
  offsetY: 0,
  startX: 0,
  startY: 0,
}

makeCards(cardCount)

addEventListener('mousedown', tryStartDrag)
addEventListener('mousemove', tryDrag)
addEventListener('mouseup', tryEndDrag)

function makeCards(count) {
  const cards = []
  const width = innerWidth / (cardsPerRow + 1)
  const height = innerHeight / cardsPerRow
  const horSpaceLeft = innerWidth - width * cardsPerRow
  const gap = horSpaceLeft / (cardsPerRow + 1)

  for (let i = 0; i < count; i++) {
    const color = generateColor(i, count)

    cards.push(makeCard(color, width, height))
  }

  for (let i = 0; i < count; i++) {
    const card = cards[i]
    const x = (i % cardsPerRow) * (width + gap) + gap
    const y = Math.floor(i / cardsPerRow) * (height + gap) + gap

    Object.assign(card.style, {
      left: `${x}px`,
      top: `${y}px`,
    })
  }

  document.body.append(...cards)
}

function makeCard(color, width, height) {
  const card = document.createElement('card')

  Object.assign(card.style, {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: color,
    position: 'absolute',
    transition: '1s',
  })

  return card
}

function generateColor(index, count) {
  const hue = index / count * 360
  const saturation = 90
  const lightness = 70

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function tryStartDrag(event) {
  const card = event.target.closest('card')

  if (!card) return

  const { offsetX, offsetY } = event
  const { left: startX, top: startY } = card.getBoundingClientRect()

  document.body.append(card)
  Object.assign(dragging, { card, offsetX, offsetY, startX, startY })
  card.style.transition = null
}

function tryDrag(event) {
  const { card, offsetX, offsetY } = dragging

  if (!card) return

  const { clientX, clientY } = event
  const { scrollTop } = document.documentElement

  Object.assign(card.style, {
    left: `${clientX - offsetX}px`,
    top: `${clientY - offsetY + scrollTop}px`,
  })
}

function tryEndDrag(event) {
  const { card, startX, startY } = dragging

  if (!card) return

  const { clientX, clientY } = event
  const { scrollTop } = document.documentElement

  card.remove()

  const cardUnderMouse = document.elementFromPoint(clientX, clientY)

  if (!cardUnderMouse.matches('card')) {
    document.body.append(card)
    card.style.transition = '1s'
    dragging.card = null
    
    return
  }

  const { left: endX, top: endY } = cardUnderMouse.getBoundingClientRect()

  Object.assign(cardUnderMouse.style, {
    left: startX + 'px',
    top: startY + scrollTop + 'px',
  })

  document.body.append(card)
  dragging.card = null

  setTimeout(() => {
    card.style.transition = '1s'

    Object.assign(card.style, {
      left: endX + 'px',
      top: endY + scrollTop + 'px',
    })
  }, 0)
}
