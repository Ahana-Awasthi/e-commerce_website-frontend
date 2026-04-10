import React, { useState, useEffect, useRef } from "react";
import NavBar from "./Nav";
import "./Chatbot.css";
import botAvatar from "../assets/bot.png";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [formData, setFormData] = useState({});
  const [searchInput, setSearchInput] = useState("");

  const [showDefaultForm, setShowDefaultForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [formOpened, setFormOpened] = useState("");
  const [lastFormType, setLastFormType] = useState(""); // "default" or "feedback"
  const [showRating, setShowRating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [ratingStars, setRatingStars] = useState(0);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const chatBodyRef = useRef(null);
  const greeted = useRef(false);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "Guest";
  const userEmail = localStorage.getItem("userEmail") || "";

  const getTime = () =>
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      setIsLoadingOrders(true);
      try {
        const response = await axios.get("http://localhost:3000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [token]);

  const addMessage = (sender, text, options = []) => {
    setIsTyping(sender === "bot");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender, text, options, time: getTime() },
      ]);
      setIsTyping(false);
    }, 500);
  };

  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.sender === "bot") el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    if (!greeted.current) {
      processFlow("first_time_greeting");
      greeted.current = true;
    }
  }, []);

  const showGreeting = () => {
    const options = token
      ? [
          { label: "About a placed order", value: "order" },
          { label: "Something else", value: "else" },
          { label: "Connect to customer support", value: "support" },
          { label: "Feedback or Complaint", value: "feedback" },
        ]
      : [
          { label: "Account & Login", value: "account" },
          { label: "Connect to customer support", value: "support" },
          { label: "Feedback or Complaint", value: "feedback" },
        ];

    const greetingText = token
      ? `How can I help you?`
      : "Hi! How can I help you today?";

    addMessage("bot", greetingText, options);
  };

  const askAnythingElse = () => {
    addMessage("bot", "Anything else I can help answer for you?", [
      { label: "Yes, I need more help", value: "yes" },
      { label: "No, that's all", value: "no" },
    ]);
  };

  const handleOptionClick = (label, value) => {
    addMessage("user", label);
    if (chatBodyRef.current) chatBodyRef.current.scrollTop += 150;
    processFlow(value);
  };

  const processFlow = (option) => {
    // Handle dynamic cancel order selections
    if (option.startsWith("cancel_")) {
      const orderId = option.replace("cancel_", "");
      const order = orders.find((o) => o.orderId === orderId);
      if (order) {
        setSelectedOrder(orderId);
        setSelectedAction("cancel");
        setSelectedIssue("Cancel Request");
        addMessage(
          "bot",
          `You want to cancel ${orderId}. Please fill this form to submit your cancel request.`,
        );
        setTimeout(() => openRequestForm("Cancel Request", "cancel"), 700);
      }
      return;
    }

    // Handle dynamic order selections
    if (option.startsWith("order_")) {
      const orderId = option.replace("order_", "");
      const selectedOrderObj = orders.find((o) => o.orderId === orderId);
      if (selectedOrderObj) {
        setSelectedOrder(orderId);
        // Different options for delivered vs non-delivered orders
        if (selectedOrderObj.status === "Delivered") {
          addMessage("bot", `What would you like to do with ${orderId}?`, [
            { label: "Return", value: "return" },
            { label: "Exchange", value: "exchange" },
            { label: "Something else", value: "else" },
          ]);
        } else {
          addMessage("bot", `What would you like to do with ${orderId}?`, [
            { label: "Return", value: "return" },
            { label: "Exchange", value: "exchange" },
            { label: "Cancel", value: "cancel" },
            { label: "Something else", value: "else" },
          ]);
        }
      }
      return;
    }

    switch (option) {
      case "cancel":
        setFormOpened("cancel");

        if (selectedOrder) {
          // If order already selected, go straight to cancel form
          setSelectedAction("cancel");
          setSelectedIssue("Cancel Request");
          addMessage(
            "bot",
            `You want to cancel Order #${selectedOrder}. Please fill this form to submit your cancel request.`,
          );
          setTimeout(() => openRequestForm("Cancel Request", "cancel"), 700);
        } else {
          // Show only orders that are NOT delivered
          const cancellableOrders = orders.filter(
            (order) => order.status !== "Delivered",
          );
          if (cancellableOrders.length === 0) {
            addMessage(
              "bot",
              "You don't have any orders that can be cancelled. All your orders have been delivered.",
            );
            askAnythingElse();
          } else {
            addMessage(
              "bot",
              "Which order would you like to cancel?",
              cancellableOrders.map((order) => ({
                label: `${order.orderId} (${order.status})`,
                value: `cancel_${order.orderId}`,
              })),
              console.log(cancellableOrders),
            );
          }
        }
        break;

      case "order":
        setFormOpened("order");
        if (orders.length === 0) {
          addMessage(
            "bot",
            "You don't have any orders yet. Start shopping to place your first order!",
          );
          askAnythingElse();
        } else {
          addMessage(
            "bot",
            "Which order do you need help with?",
            orders.map((order) => ({
              label: `${order.orderId} (${order.status})`,
              value: `order_${order.orderId}`,
            })),
          );
        }
        break;
      case "return":
        setFormOpened("return");
        handleIssueSelection(option);
        break;
      case "exchange":
        setFormOpened("exchange");
        handleIssueSelection(option);
        break;
      case "first_time_greeting": {
        setFormOpened("1st-greeting");
        addMessage(
          "bot",
          `Hi ${userName}! I am ShopEase Assistant. Nice to meet you!`,
        );

        setTimeout(() => {
          showGreeting(); // normal greeting with options
        }, 600);

        break;
      }
      case "damaged_return":
      case "wrong_return":
      case "not_expected_return":
      case "size_exchange":
      case "defective_exchange":
      case "wrong_exchange": {
        const issue = option
          .replace("_return", "")
          .replace("_exchange", "")
          .replace("_", " ");
        const action = option.includes("return") ? "Return" : "Exchange";
        setSelectedIssue(issue);
        setSelectedAction(action);
        addMessage(
          "bot",
          `We understand your problem for ${selectedOrder} is "${issue}" and you want a ${action}. Kindly fill this form to request a ${action}.`,
        );
        setTimeout(() => openRequestForm(issue, action), 700);
        break;
      }
      case "else":
        addMessage("bot", "What would you like to do?", [
          { label: "Account & Login", value: "account" },
          { label: "Return & Exchange Guidelines", value: "guidelines" },
          { label: "EMI & Warranty", value: "emi" },
        ]);
        break;
      case "something_else":
        addMessage(
          "bot",
          "Please describe your issue in brief. Our team will contact you soon.",
        );
        break;
      case "account":
        addMessage("bot", "What issue are you facing with your account?", [
          { label: "Forgot Password", value: "forgot" },
          { label: "Can't Login", value: "login_issue" },
          { label: "Talk to Support", value: "support" },
        ]);
        break;
      case "forgot":
        addMessage(
          "bot",
          "We recommend storing your password in Google Password Manager or another password manager. If you still need help, our team can assist.",
          [{ label: "Contact Support", value: "support" }],
        );
        askAnythingElse();
        break;
      case "login_issue":
        addMessage(
          "bot",
          "If you cannot log in, it may be a temporary server issue or your account is active on another device. Try again after 5–6 hours. If the issue still persists, feel free to contact us.",
          [{ label: "Contact Support", value: "support" }],
        );
        askAnythingElse();
        break;
      case "guidelines":
        addMessage(
          "bot",
          'You can view our guidelines here: <a href="/PrivacyPolicy" target="_blank">Return & Exchange Guidelines</a>.',
        );
        askAnythingElse();
        break;
      case "emi":
        addMessage("bot", "Which order do you want EMI/Warranty info for?", [
          { label: "Order #1", value: "emi1" },
          { label: "Order #2", value: "emi2" },
          { label: "Order #3", value: "emi3" },
        ]);
        break;
      case "emi1":
        addMessage(
          "bot",
          "Yes, this product supports EMI of ₹1200 first month and ₹800 for next 5 months.",
        );
        askAnythingElse();
        break;
      case "emi2":
        addMessage("bot", "No, this product does not support EMI.");
        askAnythingElse();
        break;
      case "emi3":
        addMessage("bot", "This product has 3 months of warranty remaining.");
        askAnythingElse();
        break;
      case "support":
        setFormOpened("support");
        addMessage(
          "bot",
          "Please fill this form and our team will contact you.",
        );
        setTimeout(() => openRequestForm("General Support", "Support"), 600);
        break;
      case "feedback":
        setFormOpened("feedback");
        addMessage("bot", "Please fill the form to submit your feedback.");
        setTimeout(() => openRequestForm("Feedback", "Feedback"), 600);
        break;
      case "reopen_form":
        // reopen last form
        if (lastFormType === "default") setShowDefaultForm(true);
        if (lastFormType === "feedback") setShowFeedbackForm(true);
        break;
      case "edit_request":
        processFlow(formOpened);
        break;
      case "no_form":
        askAnythingElse();
        break;
      case "feedback_yes":
        setFormOpened("feedback");
        openRequestForm("Feedback", "Feedback"); // opens feedback-only form
        break;

      case "feedback_no":
        askAnythingElse();
        break;
      case "yes":
        showGreeting();
        break;
      case "no":
        addMessage("bot", "Glad we could help!");
        break;
      default:
        addMessage("bot", "Please select a valid option.");
    }
  };

  const handleIssueSelection = (option) => {
    const issues =
      option === "return"
        ? [
            { label: "Damaged product", value: "damaged_return" },
            { label: "Wrong product received", value: "wrong_return" },
            { label: "Product not as expected", value: "not_expected_return" },
          ]
        : [
            { label: "Size issue", value: "size_exchange" },
            { label: "Defective product", value: "defective_exchange" },
            { label: "Wrong product received", value: "wrong_exchange" },
          ];
    addMessage("bot", "Please select the issue you are facing:", issues);
  };
  const openRequestForm = (issue, action) => {
    if (action === "Feedback") {
      setFormData({
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
        feedback: "",
      });
      setShowFeedbackForm(true);
      setLastFormType("feedback");
    } else if (action === "Mass") {
      // NEW for mass order
      setFormData({
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
        productType: issue.replace("Mass Order Request - ", ""),
        quantity: "", // user will type
      });
      setShowDefaultForm(true); // reuse default form
      setLastFormType("mass");
    } else if (action === "cancel") {
      // NEW for cancel order
      setFormData({
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
        orderId: selectedOrder || "N/A",
        issue: `Cancel Request`, // "Cancel Request"
      });
      setShowDefaultForm(true);
      setLastFormType("cancel");
    } else {
      // existing default order/return/exchange
      setFormData({
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
        orderId: selectedOrder || "N/A",
        orderDate: "12 Feb 2026",
        issue: `${action} request - ${issue}`,
      });
      setShowDefaultForm(true);
      setLastFormType("default");
    }
  };

  const handleCancelForm = () => {
    setShowDefaultForm(false);
    setShowFeedbackForm(false);
    addMessage(
      "bot",
      "You have cancelled the request. Do you still want to register a request?",
      [
        { label: "Yes, I want to register a request", value: "reopen_form" },
        { label: "No, I don't want to register a request", value: "no_form" },
        { label: "I want to edit the request", value: "edit_request" },
      ],
    );
  };

  const handleDefaultFormSubmit = (e) => {
    e.preventDefault();

    // MASS ORDER QUANTITY CHECK
    if (lastFormType === "mass") {
      const qty = parseInt(formData.quantity);
      if (!qty || qty < 50) {
        addMessage(
          "bot",
          "You can order **at least 50 products** directly. Please increase the quantity.",
        );
        return; // stop submission
      }
    }

    // Close the form
    setShowDefaultForm(false);

    const token = localStorage.getItem("token");

    if (lastFormType === "cancel") {
      // Cancel order - update status to problem:cancel immediately
      if (token && selectedOrder) {
        axios
          .post(
            `http://localhost:3000/api/cancel-order/${selectedOrder}`,
            { immediate: true },
            { headers: { Authorization: `Bearer ${token}` } },
          )
          .catch((err) => console.error("Error cancelling order:", err));
      }

      addMessage(
        "bot",
        `Your cancel request for ${selectedOrder} has been submitted successfully. The order status has been updated.`,
      );
      askAnythingElse();
    } else if (
      lastFormType === "default" &&
      formData.issue?.includes("Return")
    ) {
      // Return order - update status to problem:return
      if (token && selectedOrder) {
        axios
          .post(
            `http://localhost:3000/api/return-order/${selectedOrder}`,
            { reason: formData.orderIssueDes || "" },
            { headers: { Authorization: `Bearer ${token}` } },
          )
          .catch((err) => console.error("Error submitting return:", err));
      }

      addMessage(
        "bot",
        `Your return request for ${selectedOrder} has been submitted successfully. The order status has been updated.`,
      );
      askAnythingElse();
    } else if (
      lastFormType === "default" &&
      formData.issue?.includes("Exchange")
    ) {
      // Exchange order - update status to problem:exchange
      if (token && selectedOrder) {
        axios
          .post(
            `http://localhost:3000/api/exchange-order/${selectedOrder}`,
            { reason: formData.orderIssueDes || "" },
            { headers: { Authorization: `Bearer ${token}` } },
          )
          .catch((err) => console.error("Error submitting exchange:", err));
      }

      addMessage(
        "bot",
        `Your exchange request for ${selectedOrder} has been submitted successfully. The order status has been updated.`,
      );
      askAnythingElse();
    } else {
      addMessage(
        "bot",
        "Your request has been submitted successfully. Our team will contact you soon.",
      );
      askAnythingElse();
    }

    // Reset rating
    setRatingStars(0);
    setShowRating(true);

    // OPTIONAL: reset form data
    setFormData({});
  };
  const handleFeedbackFormSubmit = (e) => {
    e.preventDefault();
    setShowFeedbackForm(false);
    addMessage(
      "bot",
      "Thank you for your feedback/complaint! We appreciate your input.",
    );
    askAnythingElse();
    setRatingStars(0);
    setShowRating(true);
  };

  const handleRating = (star) => {
    setRatingStars(star);
    setShowRating(false); // close rating popup

    if (lastFormType !== "feedback") {
      if (star <= 3) {
        addMessage(
          "bot",
          "We are sorry that your experience with us was not good. We will definitely work to improve it.",
        );
      } else {
        addMessage(
          "bot",
          "We are glad you like our service. We are constantly working to improve it!",
        );
      }

      // Ask user if they want to give feedback
      setTimeout(() => {
        addMessage(
          "bot",
          "We will be glad if you could give us feedback. Do you want to give feedback?",
          [
            { label: "Yes", value: "feedback_yes" },
            { label: "No", value: "feedback_no" },
          ],
        );
      }, 500);

      setLastFormType("feedback");
    }
  };

  return (
    <>
      <NavBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <div className="chat-container" style={{ height: "500px" }}>
        <div className="chat-header">
          <img src={botAvatar} alt="Bot" className="bot-avatar" />
          <h5>ShopEase Assistant</h5>
        </div>

        <div
          ref={chatBodyRef}
          className="chat-body"
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`msg-box ${msg.sender}-msg`}>
              <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>

              {msg.options?.length > 0 && (
                <div className="option-box">
                  {msg.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt.label, opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              <span className="msg-time">{msg.time}</span>
            </div>
          ))}

          {isTyping && <div className="bot-msg msg-box">Bot is typing...</div>}
        </div>
      </div>

      {/* Default Request Form */}
      {showDefaultForm && (
        <div className="form-popup">
          <form onSubmit={handleDefaultFormSubmit} className="popup-form">
            <h4>Submit Request</h4>
            <label>Name</label>
            <input
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <label>Email</label>
            <input
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {formOpened !== "support" && (
              <>
                <label>Order ID</label>
                <input
                  value={formData.orderId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, orderId: e.target.value })
                  }
                />
              </>
            )}
            {formOpened !== "support" && (
              <>
                <label>Order Date</label>
                <input
                  value={formData.orderDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, orderDate: e.target.value })
                  }
                />
              </>
            )}
            <label>Issue</label>
            <input
              value={formData.issue || ""}
              onChange={(e) =>
                setFormData({ ...formData, issue: e.target.value })
              }
              readOnly
            />
            {formOpened !== "feedback" && (
              <>
                <label>Describe your issue in 2-3 lines</label>
                <textarea
                  value={formData.orderIssueDes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, orderIssueDes: e.target.value })
                  }
                />
              </>
            )}
            <div className="form-buttons">
              <button type="submit" className="button">
                Submit
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                className="cancel button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback/Complaint Form */}
      {showFeedbackForm && (
        <div className="form-popup">
          <form onSubmit={handleFeedbackFormSubmit} className="popup-form">
            <h4>Feedback / Complaint</h4>
            <label>Name</label>
            <input
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <label>Email</label>
            <input
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <label>Your Feedback / Complaint</label>
            <textarea
              value={formData.feedback || ""}
              onChange={(e) =>
                setFormData({ ...formData, feedback: e.target.value })
              }
            />
            <div className="form-buttons">
              <button type="submit" className="button">
                Submit
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                className="cancel button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showRating && (
        <div className="rating-popup">
          <span className="close-rating" onClick={() => setShowRating(false)}>
            ×
          </span>
          <h4>Rate Us</h4>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                onClick={() => handleRating(s)}
                style={{ color: s <= ratingStars ? "gold" : "lightgray" }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
