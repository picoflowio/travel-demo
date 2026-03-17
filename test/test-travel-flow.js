/**
 * TravelFlow Integration Test
 * Tests the full conversation flow: destination → package selection → booking → end
 * 
 * Usage: node test/test-travel-flow.js
 * Make sure the service is running on port 8000 before executing.
 */

async function testTravelFlow() {
  const url = 'http://localhost:8000/ai/run';
  let sessionId = null;

  async function sendMessage(message) {
    const headers = { 'Content-Type': 'application/json' };
    if (sessionId) headers['CHAT_SESSION_ID'] = sessionId;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, flowName: 'TravelFlow' }),
    });

    const data = await response.json();
    // Extract session ID from response header (lowercase in fetch API)
    const newSessionId = response.headers.get('chat_session_id');
    if (newSessionId) sessionId = newSessionId;

    return data;
  }

  console.log('=== TravelFlow Integration Test ===\n');

  // 1. Start the conversation
  console.log('-> User: Hello');
  let data = await sendMessage('Hello');
  console.log(`<- Bot [Session: ${sessionId}]: ${data.message}`);
  console.log(`   completed: ${data.completed}\n`);

  // 2. Request a combination package
  console.log('-> User: combination package');
  data = await sendMessage('combination package');
  console.log(`<- Bot: ${data.message}`);
  console.log(`   completed: ${data.completed}\n`);

  // 3. Provide travel details
  const travelDetails = 'PDX, Madrid, 4/21/2026, 5/5/2026, 2, Luxury, $7000';
  console.log(`-> User: ${travelDetails}`);
  data = await sendMessage(travelDetails);
  console.log(`<- Bot: ${data.message}`);
  console.log(`   completed: ${data.completed}\n`);

  // 4. Select premium package
  console.log('-> User: I choose Premium.');
  data = await sendMessage('I choose Premium.');
  console.log(`<- Bot: ${data.message}`);
  console.log(`   completed: ${data.completed}\n`);

  // 5. End the session
  console.log('-> Ending session...');
  const endResponse = await fetch('http://localhost:8000/ai/end', {
    method: 'POST',
    headers: { 'CHAT_SESSION_ID': sessionId },
  });
  const endData = await endResponse.json();
  console.log(`<- End session: ${JSON.stringify(endData)}\n`);

  if (data.completed === true && endData.success === true) {
    console.log('✅ Test completed successfully!');
  } else {
    console.log('❌ Test failed — flow did not complete as expected.');
    process.exit(1);
  }
}

testTravelFlow().catch((err) => {
  console.error('❌ Test error:', err.message);
  process.exit(1);
});
