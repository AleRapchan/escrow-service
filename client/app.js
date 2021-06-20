// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3 } from "web3";
import { default as contract } from "truffle-contract";

// Import our contract artifacts and turn them into usable abstractions.
import escrow_artifacts from "../../build/contracts/Escrow.json";

// Escrow is our usable abstraction, which we'll use through the code below.
var Escrow = contract(escrow_artifacts);

window.makeTransaction = function () {
  $("#transMsg").hide();
  let receiver = $("#receiver").val();
  let amount = $("#amount").val();
  let days = $("#deadline").val();
  let collateral = $("#collateral").val();

  Escrow.deployed().then(function (contractInstance) {
    contractInstance
      .makeTransaction(receiver, days, web3.toWei(collateral, "ether"), {
        value: web3.toWei(amount, "ether"),
        from: web3.eth.accounts[0],
      })
      .then(function (v) {
        $("#transMsg").show();
        console.log(v);
      });
  });
};

window.checkSentTransactions = function () {
  $("#tableSent").show();
  $("#sentId").show();
  $("#checkSentId").show();
  $("#recId").hide();
  $("#checkRecId").hide();
  $("#tableRec").hide();
  $("#tableRecTrans").hide();
  $("#sendMsg").hide();
  $("#recMsg").hide();

  $("#tableInfo").html("");

  Escrow.deployed().then(function (contractInstance) {
    contractInstance.getSentTransactions
      .call({ from: web3.eth.accounts[0] })
      .then(function (v) {
        let ids = v[0];
        let addresses = v[1];

        for (let i = 0; i < ids.length; i++) {
          $("#tableInfo").append(
            "<tr><td>" +
              ids[i].toString() +
              "</td><td>" +
              addresses[i] +
              "</td></tr>"
          );
        }
      });
  });
};

window.checkRecTransactions = function () {
  $("#tableRec").show();
  $("#recId").show();
  $("#checkRecId").show();
  $("#tableSent").hide();
  $("#tableSentTrans").hide();
  $("#sentId").hide();
  $("#checkSentId").hide();
  $("#sendMsg").hide();
  $("#recMsg").hide();

  $("#tableInfoR").html("");

  Escrow.deployed().then(function (contractInstance) {
    contractInstance.getRecTransactions
      .call({ from: web3.eth.accounts[0] })
      .then(function (v) {
        let ids = v[0];
        let addresses = v[1];

        for (let i = 0; i < ids.length; i++) {
          $("#tableInfoR").append(
            "<tr><td>" + ids[i] + "</td><td>" + addresses[i] + "</td></tr>"
          );
        }
      });
  });
};

window.checkSentTransaction = function () {
  let id = $("#sentId").val();

  Escrow.deployed().then(function (contractInstance) {
    contractInstance.getSentTransactionData
      .call(id, { from: web3.eth.accounts[0] })
      .then(function (v) {
        let amount = parseFloat(v[0].toString());
        if (amount == 0 || v[5]) {
          $("#tableSentTrans").hide();
          $("#sendMsg")
            .text("Transaction is either nonexistent or completed")
            .show();
          return;
        }

        $("#tableSentTrans").show();
        $("#sendMsg").hide();

        let deadline = parseFloat(v[1].toString());

        $("#tableId").text(id);
        $("#tableAmount").text(web3.fromWei(amount, "ether"));
        if (v[2]) {
          $("#tableAccepted").text("Accepted");
          $("#tableFinalize").html(
            "<a href='#' onclick='finalize()' class='btn btn-default'>Finalize</a>"
          );

          let date = new Date(deadline * 1000);

          let dateString = "";

          dateString += date.getMonth() + 1 + "/";
          dateString += date.getDate() + "/";
          dateString += date.getFullYear() + " ";
          dateString += date.getHours() + ":";
          dateString += date.getMinutes();

          $("#tableDeadline").text(dateString);
          $("#tableDispute").html(
            "<a href='#' onclick='dispute()' class='btn btn-default'>Dispute</a><br><input type='number' id='addDispute' placeholder='Days' style='width:75px'>"
          );
        } else {
          $("#tableAccepted").text("Not Accepted");
          $("#tableDeadline").text(deadline + " day(s)");
          $("#tableFinalize").text("Not Accepted");
          $("#tableDispute").text("Not Accepted");
        }

        if (v[3]) {
          $("#tableWithdrawal").html(
            "<a href='#' onclick='senderWithdrawal()' class='btn btn-default'>Withdraw</a>"
          );
        } else {
          $("#tableWithdrawal").text("Cannot Withdraw");
        }

        let collateral = parseFloat(v[4].toString());
        $("#tableCollateral").text(web3.fromWei(collateral, "ether"));
      });
  });
};

window.checkRecTransaction = function () {
  let id = $("#recId").val();

  Escrow.deployed().then(function (contractInstance) {
    contractInstance.getRecTransactionData
      .call(id, { from: web3.eth.accounts[0] })
      .then(function (v) {
        $("#tableIdR").text(id);
        let amount = parseFloat(v[0].toString());

        if (amount == 0 || v[5]) {
          $("#tableRecTrans").hide();
          $("#recMsg")
            .text("Transaction is either nonexistent or completed")
            .show();
          return;
        }
        $("#tableRecTrans").show();
        $("recMsg").hide();
        let deadline = parseFloat(v[1].toString());

        $("#tableAmountR").text(web3.fromWei(amount, "ether"));

        if (v[2]) {
          $("#tableAcceptedR").text("Accepted");

          let date = new Date(deadline * 1000);

          let dateString = "";

          dateString += date.getMonth() + 1 + "/";
          dateString += date.getDate() + "/";
          dateString += date.getFullYear() + " ";
          dateString += date.getHours() + ":";
          dateString += date.getMinutes();

          $("#tableDeadlineR").text(dateString);
          $("#refund").html(
            "<a href='#' onclick='refund()' class='btn btn-default'>Refund</a>"
          );
          $("#refundH").show();
          $("#refund").show();
        } else {
          $("#tableAcceptedR").html(
            "<a href='#' onclick='acceptTransaction()' class='btn btn-default'>Accept</a>"
          );
          $("#tableDeadlineR").text(deadline + " day(s)");
          $("#refundH").hide();
          $("#refund").hide();
        }

        if (v[3]) {
          $("#tableWithdrawalR").html(
            "<a href='#' onclick='recWithdrawal()' class='btn btn-default'>Withdraw</a>"
          );
        } else {
          $("#tableWithdrawalR").text("Cannot Withdraw");
        }

        let collateral = parseFloat(v[4].toString());
        $("#tableCollateralR").text(web3.fromWei(collateral, "ether"));
      });
  });
};

window.acceptTransaction = function () {
  let id = $("#tableIdR").text();
  let collateral = $("#tableCollateralR").text();

  Escrow.deployed().then(function (contractInstance) {
    contractInstance
      .acceptTransaction(id, {
        gas: 140000,
        value: web3.toWei(collateral, "ether"),
        from: web3.eth.accounts[0],
      })
      .then(function () {});
  });
};

window.recWithdrawal = function () {
  let id = $("#tableIdR").text();

  Escrow.deployed().then(function (contractInstance) {
    contractInstance
      .receiverWithdrawal(id, { gas: 140000, from: web3.eth.accounts[0] })
      .then(function (v) {});
  });
};

window.senderWithdrawal = function () {
  let id = $("#tableId").text();

  Escrow.deployed().then(function (contractInstance) {
    contractInstance
      .senderWithdrawal(id, { gas: 140000, from: web3.eth.accounts[0] })
      .then(function (v) {});
  });
};

window.finalize = function () {
  let id = $("#tableId").text();

  Escrow.deployed().then(function (contractInstance) {
    contractInstance
      .finalizeTransaction(id, { gas: 140000, from: web3.eth.accounts[0] })
      .then(function (v) {});
  });
};

window.dispute = function () {
  let id = $("#tableId").text();
  let days = $("#addDispute").val();

  Escrow.deployed().then(function (contractInstance) {
    contractInstance
      .disputeTransaction(id, days, { gas: 140000, from: web3.eth.accounts[0] })
      .then(function (v) {});
  });
};

window.refund = function () {
  let id = $("#tableIdR").text();

  Escrow.deployed().then(function (contractInstance) {
    contractInstance
      .refundTransaction(id, { gas: 140000, from: web3.eth.accounts[0] })
      .then(function (v) {});
  });
};

$(document).ready(function () {
  // if (typeof web3 !== 'undefined') {
  console.warn("Using web3 detected from external source like Metamask");
  //Use Mist/MetaMask's provider
  window.web3 = new Web3(web3.currentProvider);
  // } else {
  //   console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
  //   // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  //   window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  // }

  Escrow.setProvider(web3.currentProvider);
});
