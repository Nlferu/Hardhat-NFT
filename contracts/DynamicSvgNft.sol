// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

error ERC721Metadata__URI_QueryFor_NonExistentToken();

contract DynamicSvgNft is ERC721, Ownable {
    uint256 private s_tokenCounter;
    string private s_lowImageURI;
    string private s_highImageURI;

    AggregatorV3Interface internal immutable i_priceFeed;

    mapping(uint256 => int256) private s_tokenIdToHighValues;

    event CreatedNFT(uint256 indexed tokenId, int256 highValue);

    // If price of ETH will be below we will get lowSvg image and if above X we will get highSvg
    constructor(address priceFeedAddress, string memory lowSvg, string memory highSvg) ERC721("Dynamic SVG NFT", "DSN") {
        s_tokenCounter = 0;
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
        // setLowSVG(lowSvg);
        // setHighSVG(highSvg);
        s_lowImageURI = svgToImageURI(lowSvg);
        s_highImageURI = svgToImageURI(highSvg);
    }

    // function setLowURI(string memory svgLowURI) public onlyOwner {
    //     s_lowImageURI = svgLowURI;
    // }

    // function setHighURI(string memory svgHighURI) public onlyOwner {
    //     s_highImageURI = svgHighURI;
    // }

    // function setLowSVG(string memory svgLowRaw) public onlyOwner {
    //     string memory svgURI = svgToImageURI(svgLowRaw);
    //     setLowURI(svgURI);
    // }

    // function setHighSVG(string memory svgHighRaw) public onlyOwner {
    //     string memory svgURI = svgToImageURI(svgHighRaw);
    //     setHighURI(svgURI);
    // }

    function mintNft(int256 highValue) public {
        s_tokenIdToHighValues[s_tokenCounter] = highValue;
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
        emit CreatedNFT(s_tokenCounter, highValue);
    }

    // You could also just upload the raw SVG and have solildity convert it!
    function svgToImageURI(string memory svg) public pure returns (string memory) {
        // SVG is coded so we are using base64 to turn code into long string
        // If we add this string at the end of below "data:image..." we will get url with stored image
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) {
            revert ERC721Metadata__URI_QueryFor_NonExistentToken();
        }
        (, int256 price, , , ) = i_priceFeed.latestRoundData();
        string memory imageURI = s_lowImageURI;
        if (price >= s_tokenIdToHighValues[tokenId]) {
            imageURI = s_highImageURI;
        }
        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(),
                                '", "description":"An NFT that changes based on the Chainlink Feed", ',
                                '"attributes": [{"trait_type": "coolness", "value": 100}], "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function getLowSVG() public view returns (string memory) {
        return s_lowImageURI;
    }

    function getHighSVG() public view returns (string memory) {
        return s_highImageURI;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
