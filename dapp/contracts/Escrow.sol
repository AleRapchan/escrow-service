//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @dev Implements a single role access control contract.
import "./AccessControl.sol";
//import "@openzeppelin/contracts/access/AccessControl.sol";


/// @title EscrowService Contract
/// @author Alexandre Rapchan B. Barros (from BlockExplorers' Team )
/// @notice Building a Escrow Service using OpenZeppelin Escrow and RBAC
/// @dev Not using SafeMath cause we are already using pragma 0.8.0

contract EscrowService is AccessControl { //Ownable, 

    // @dev Roles are referred to by their bytes32 identifier. 
    // @dev These should be exposed in the external API and be unique. 
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");
    bytes32 public constant SELLER_ROLE = keccak256("SELLER_ROLE");


    /// @dev Defining initial varible to work with the escrow contract
    address vault;
    address root;
    address payable agent;
    address payable buyer;
    address payable seller;
    
    /// @dev Defining varible that will hold the values transactionated in the contract
    uint256 public price;
    uint256 public fee;

    /// @dev State varible to track escrow stage
    uint32 public status;
    
    /// @dev Create the community role, with `root` as a member.
    constructor(address payable _buyer_address, address payable _seller_address, uint32 _price) {
        
        status = 0 ;
        vault = address(this);
        root = msg.sender;
        agent = payable(msg.sender);
        buyer = _buyer_address;
        seller= _seller_address;
        price = _price*10**18;
        fee = 1*10**18;
        
        _setupRole(AGENT_ROLE, agent);
        _setupRole(BUYER_ROLE, buyer);
        _setupRole(SELLER_ROLE, seller);
    }
            
    /// @notice This should be the first stage of the negociation! //address payable _seller, uint _price
    function BuyerSendPayment() external payable onlyRole(BUYER_ROLE) { 
        require (msg.value > fee, "Escrow Agent tax of 1 Ether must be covered!");
        //require (_seller == seller, "Buyer must confirm the seller address!");
        require (msg.value >= price, "Buyer should pay at least the minimal price for the products or services.");
        require (status == 0 , "This should be the first stage of the negociation!");
        status = 1 ; 
        payable(agent).transfer(fee);
        uint256 new_price = price - fee;
        payable(vault).transfer(new_price); 

    }

    /// @notice This should be the second stage of the negociation!"
    function SellerClaimPayment () public onlyRole(SELLER_ROLE) {
        require (status == 1 , "This should be the second stage of the negociation!");
        status = 2 ;
    }

    /// @notice Only the buyer can confirm the deliver.
    function BuyerConfirmDeliver () payable public onlyRole(BUYER_ROLE) {
        require (status == 2 , "This should be the third stage of the negociation!");
        status = 5 ;
        seller.transfer(vault.balance);
    }

    /// @notice Only the buyer can deny the deliver.
    function BuyerDenyDeliver () public onlyRole(BUYER_ROLE) {
        require (status == 2 , "This should be the third stage of the negociation!");
        status = 4 ;
    }
  
    /// @notice If conditions met: escrow agent releases to seller.
    function AgentConfirmTransaction () public onlyRole(AGENT_ROLE) {
        require (status == 3 , "This should be the fourth stage of the negociation!");
        status = 5 ;
        agent.transfer(vault.balance);
    }

    /// @notice If conditions does not met: escrow agent revert to buyer.
    function AgentCancelTransaction () onlyRole(AGENT_ROLE) public {
        require (status == 3 , "This should be the fourth stage of the negociation!");
        status = 5 ;
        buyer.transfer(vault.balance); 
    }

    /// @notice Only the agent can check vault balance.
    function VaultBalance () public onlyRole(AGENT_ROLE) returns(uint256){
        require (status >=1 , "Transaction not started yet!");
        status = 5 ;
        return vault.balance;
    }

}