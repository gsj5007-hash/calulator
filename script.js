// ===== 1. 화면 부품 가져오기 =====
const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");
const operatorSelect = document.getElementById("operator");
const calcButton = document.getElementById("calcBtn");
const resultText = document.getElementById("result");
const errorText = document.getElementById("error");
const clearButton = document.getElementById("clearBtn");
const historyList = document.getElementById("history");
// ===== 2. 입력값 검증 =====
// 문자열을 숫자로 바꾸고, 문제가 있으면 오류 메시지를 돌려준다
function parseNumber(text, label) {
  const trimmed = text.trim();            // 앞뒤 공백 제거

  if (trimmed === "") {
    return { error: `${label}를 입력하세요.` };
  }

  const value = Number(trimmed);          // 문자열 → 숫자
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return { error: `${label}가 올바른 숫자가 아닙니다: "${trimmed}"` };
  }

  return { value: value };
}

// ===== 3. 사칙연산 =====
function calculate(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        throw new Error("0으로 나눌 수 없습니다.");
      }
      return a / b;
    default:
      throw new Error("알 수 없는 연산자입니다.");
  }
}

// ===== 4. 결과 표시 =====
function showResult(a, b, operator, answer) {
  const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  // 0.1 + 0.2 = 0.30000000000000004 같은 오차를 정리
  const rounded = Math.round(answer * 1e10) / 1e10;
  resultText.textContent = `${a} ${symbols[operator]} ${b} = ${rounded}`;
  errorText.textContent = "";
    // 기록 한 줄 만들기
  const li = document.createElement("li");   // 새 <li> 만들기
  li.textContent =  `${a} ${symbols[operator]} ${b} = ${rounded}`;  // 화면 결과와 같은 문장 넣기
  historyList.prepend(li);                     // 목록 맨 위에 붙이기
}

function showError(message) {
  resultText.textContent = "결과가 여기에 표시됩니다";
  errorText.textContent = message;
}

// ===== 5. 버튼을 눌렀을 때의 전체 흐름 =====
function onCalculate() {
  const first = parseNumber(num1Input.value, "첫 번째 숫자");
  if (first.error) {
    showError(first.error);
    return;
  }

  const second = parseNumber(num2Input.value, "두 번째 숫자");
  if (second.error) {
    showError(second.error);
    return;
  }

  const operator = operatorSelect.value;

  try {
    const answer = calculate(first.value, second.value, operator);
    showResult(first.value, second.value, operator, answer);
  } catch (e) {
    showError(e.message);
  }
}
// ===== 지우기 =====
function onClear() {
  num1Input.value = "";
  num2Input.value = "";
  resultText.textContent = "결과가 여기에 표시됩니다";
  errorText.textContent = "";
}

// ===== 6. 이벤트 연결 =====
calcButton.addEventListener("click", onCalculate);
clearButton.addEventListener("click", onClear);
// 입력칸에서 Enter 키를 눌러도 계산
[num1Input, num2Input].forEach(function (input) {
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      onCalculate();
    }
  });
});
